import * as yup from 'yup'


const idSchema = yup.number().required("ID_OBRIGATORIO");

export const inscricoesGetByIdSchema = yup.object({
    id : idSchema
});
export const inscricoesDeleteSchema = yup.object({
    id : idSchema
})

export const inscricoesCreateSchema = yup.object({
    alunoId : yup.string().uuid().required(),
    monitoriaId : yup.string().uuid().required()
});
