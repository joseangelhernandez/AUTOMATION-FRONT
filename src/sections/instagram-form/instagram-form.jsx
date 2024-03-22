/* eslint-disable react/no-unescaped-entities */
import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import ButtonBase from '@mui/material/ButtonBase';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { useResponsive } from 'src/hooks/use-responsive';

import { InstagramAutomationService } from 'src/services/ig-automation/ig-automation-service-calls';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField, RHFRadioGroup } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export const REACCIONMEGUSTA = [
  { value: 0, label: 'No reaccionar' },
  { value: 1, label: 'Aleatorio Automático' },
  { value: 2, label: 'Todas' },
];

// ----------------------------------------------------------------------

export default function InstagramForm({ AccountsQty }) {
  const mdUp = useResponsive('up', 'md');

  const { enqueueSnackbar } = useSnackbar();

  const InstagramFormSchema = Yup.object().shape({
    Url: Yup.string().required('La URL es obligatoria'),
    CustomComments: Yup.string().required('Los comentarios son obligatorios'),
    AmountAccountType: Yup.string(),
    LikesBehaviour: Yup.number(),
    AccountsQuantity: Yup.number().when('AmountAccountType', {
      is: 'Personalizado',
      then: (schema) =>
        schema
          .required('La cantidad de cuentas es obligatoria')
          .min(1, 'Mínimo 1 cuenta')
          .max(AccountsQty, `Máximo ${AccountsQty} cuentas`),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      Url: '',
      CustomComments: '',
      LikesBehaviour: 0,
      CommentsBehaviour: 2,
      AmountAccountType: 'Todas',
      AccountsQuantity: 0,
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(InstagramFormSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      data.AmountAccountType = data.AmountAccountType === 'Personalizado' ? 1 : 0;

      if (data.CustomComments.includes('\n')) data.CustomComments = data.CustomComments.split('\n');

      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await InstagramAutomationService(data);

      reset();
      enqueueSnackbar('Automatización completada');
      console.info('RESPONSE', response);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Detalles
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Enlace, comentarios.
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Detalles" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Enlace del post</Typography>
              <RHFTextField name="Url" label="URL" />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Comentarios</Typography>
              <RHFTextField
                multiline
                rows={4}
                name="CustomComments"
                placeholder="Escriba un comentario por línea..."
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Condiciones
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Define atributos adicionales de la automatización.
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Condiciones" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Reaccionar a "Me gusta"</Typography>
              <RHFRadioGroup row spacing={4} name="LikesBehaviour" options={REACCIONMEGUSTA} />
            </Stack>

            <Stack spacing={2}>
              <Typography variant="subtitle2">Cantidad de cuentas</Typography>

              <Controller
                name="AmountAccountType"
                control={control}
                render={({ field }) => (
                  <Box gap={2} display="grid" gridTemplateColumns="repeat(2, 1fr)">
                    {[
                      {
                        label: 'Todas',
                        icon: (
                          <Iconify icon="icon-park-outline:data-all" width={32} sx={{ mb: 2 }} />
                        ),
                      },
                      {
                        label: 'Personalizado',
                        icon: (
                          <Iconify
                            icon="material-symbols:custom-typography-rounded"
                            width={32}
                            sx={{ mb: 2 }}
                          />
                        ),
                      },
                    ].map((item) => (
                      <Paper
                        component={ButtonBase}
                        variant="outlined"
                        key={item.label}
                        onClick={() => field.onChange(item.label)}
                        sx={{
                          p: 2.5,
                          borderRadius: 1,
                          typography: 'subtitle2',
                          flexDirection: 'column',
                          ...(item.label === field.value && {
                            borderWidth: 2,
                            borderColor: 'text.primary',
                          }),
                        }}
                      >
                        {item.icon}
                        {item.label}
                      </Paper>
                    ))}
                  </Box>
                )}
              />

              {watch('AmountAccountType') === 'Personalizado' && (
                <>
                  <Typography variant="subtitle2" sx={{ color: 'green' }}>
                    Cantidad de cuentas disponibles: {AccountsQty}
                  </Typography>
                  <RHFTextField
                    name="AccountsQuantity"
                    placeholder="0"
                    type="number"
                    label="Cantidad de cuentas"
                  />
                </>
              )}
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{ display: 'flex', justifyContent: 'end' }}>
        <LoadingButton
          type="submit"
          variant="contained"
          size="large"
          loading={isSubmitting}
          sx={{ ml: 2 }}
        >
          Iniciar Automatización
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}

InstagramForm.propTypes = {
  AccountsQty: PropTypes.number,
};
