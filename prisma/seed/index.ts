import { runBibleImport } from './bible-import.service';

runBibleImport()
  .then(() => console.log('Seed finalizado com sucesso.'))
  .catch((err) => {
    console.error('Erro ao rodar o seed:', err);
  });
