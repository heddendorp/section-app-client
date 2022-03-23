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
      case 'esnCard'.toLocaleLowerCase(): {
        res.redirect(
          'https://tumi.esn.world/events/998851e2-17af-482c-99cb-99a29b543d60'
        );
        return;
      }
      case 'chatGroup'.toLocaleLowerCase(): {
        res.redirect('https://t.me/+PtNU9JqOE19lZjMy');
        return;
      }
    }
    res.status(404).send('No URL found');
  });
  return router;
};
