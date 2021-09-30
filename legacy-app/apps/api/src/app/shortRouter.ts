import * as express from 'express';

export const shortRouter = () => {
  const router = express.Router();

  router.get('/:slug', async (req, res) => {
    const slug = req.params.slug;
    console.log('Rerouting: ', slug);
    switch (slug.toLocaleLowerCase()) {
      case 'Whatsapp2021W'.toLocaleLowerCase(): {
        res.redirect('https://chat.whatsapp.com/EZDqNSzprY69gQwhQN14eh');
        return;
      }
    }
    res.status(404).send('No URL found');
  });
  return router;
};
