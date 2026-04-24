import * as yup from 'yup'


const idSchema = yup.string().uuid().required("ID_OBRIGATORIO");

export const alunoGetByIdSchema = yup.object({
    id : idSchema
});

// validação de id e de dados diferentes para a rota put

export const alunoUpdateIdSchema = yup.object({
    id : idSchema
})

export const alunoUpdateSchema = yup.object({
    nome : yup.string().optional(),
    senha : yup.string().optional(),
    email : yup.string().email().optional(),
    matricula : yup.string().optional(),
    perfil : yup.string().optional()
})

export const alunoDeleteSchema = yup.object({
    id : idSchema
})

export const alunoCreateSchema = yup.object({
    nome : yup.string().required(),
    senha : yup.string().required(),
    email : yup.string().email().required(),
    matricula : yup.string().min(8).max(11).required(),
});

export const alunoUpdatePerfilSchema = yup.object({
    perfilId : yup.number().integer().min(1).max(3).required("PERFIL_ID_OBRIGATORIO"),
});

