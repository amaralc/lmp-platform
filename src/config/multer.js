/* --------------------------------- IMPORTS ---------------------------------*/
import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

/* --------------------------------- CONTENT ---------------------------------*/
/* --------------------------------- EXPORTS ---------------------------------*/
export default {
  /**
   * Como multer vai guardar nossos arquivos de imagem.
   * Obs.: existem varias formas de armazenar, como em CDNs (Content Delivery
   * Networks) tipo a Amazon s3 e digital ocean spaces). No nosso caso iremos
   * guardar as imagens dentro dos arquivos da aplicacao, na pasta 'tmp' usando
   * o multer.diskStorage ;
   */
  storage: multer.diskStorage({
    /** Destino do arquivo que esta sendo enviado para a aplicacao */
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),

    /**
     * Controle da formatacao do nome do arquivo enviado pelo usuario.
     * Evita que usuarios enviem caracteres estranhos ou com nomes de arquivos duplicados.
     */
    filename: (req, file, cb) => {
      /** Configura numero de bytes aleatorios */
      crypto.randomBytes(16, (err, res) => {
        /** Se houber erro, retorna callback com erro */
        if (err) return cb(err);

        /**
         * Se nao houver erro, envia primeiro argumento como nulo e retorna
         * string com random bytes concatenada com a extensao do arquivo;
         */
        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
