import * as yup from 'yup'


const idSchema = yup.number().required("ID_OBRIGATORIO");

export const disciplinaGetByIdSchema = yup.object({
    id : idSchema
});


export const disciplinaUpdateIdSchema = yup.object({
    id : idSchema
})
export const disciplinaUpdateSchema = yup.object({
    nome : yup.string().optional(),
    descricao : yup.string().optional()
})

export const disciplinaDeleteSchema = yup.object({
    id : idSchema
})

export const disciplinaCreateSchema = yup.object({
    nome : yup.string().required(),
    descricao : yup.string().optional()
});
