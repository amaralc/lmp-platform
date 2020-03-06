/* --------------------------------- IMPORTS ---------------------------------*/
import File from '../models/File';

/* --------------------------------- CONTENT ---------------------------------*/
class FileController {
  async store(req, res) {
    /**
     * Desestrutura 'req.file' salvando apenas informações 'originalname' (multer)
     * como 'name' (model) e 'filename' (multer) como 'path' (model).
     */
    const { originalname: name, filename: path } = req.file;

    /**
     * Cria variável 'file' utilizando 'name' e 'path' obtidos de 'req.file'
     */
    const file = await File.create({
      name,
      path,
    });

    /** Retorna 'file' em formato JSON */
    return res.json(file);
  }
}

/* --------------------------------- EXPORTS ---------------------------------*/
export default new FileController();
