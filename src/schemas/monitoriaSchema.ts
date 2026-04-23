import * as yup from "yup";


const idSchema = yup.string().uuid().required("ID_OBRIGATORIO");

export const monitoriaGetByIdSchema = yup.object({
  id: idSchema,
});

export const monitoriaDeleteSchema = yup.object({
  id: idSchema,
});


export const monitoriaUpdateIdSchema = yup.object({
  id: idSchema,
});
export const monitoriaUpdateSchema = yup.object({
  nome_monitoria: yup.string().optional(),
  data: yup.string().matches(/^\d{4}-\d{2}-\d{2}$/).optional(),
  hora_inicio: yup.string().matches(/^\d{2}:\d{2}$/).optional(),
  hora_fim: yup.string().matches(/^\d{2}:\d{2}$/).optional(),
  descricao: yup.string().max(200).optional(),
  localId: yup.string().optional(),
  monitorId: yup.string().optional(),
  disciplinaId: yup.string().optional(),
});


export const monitoriaCreateSchema = yup.object({
  nome_monitoria: yup.string().required(),
  data: yup.string().matches(/^\d{4}-\d{2}-\d{2}$/).required(),
  hora_inicio: yup.string().matches(/^\d{2}:\d{2}$/).required(),
  hora_fim: yup.string().matches(/^\d{2}:\d{2}$/).required(),
  descricao: yup.string().max(200).optional(),
  localId: yup.string().optional(),
  monitorId: yup.string().required(),
  disciplinaId: yup.string().required(),
});
