const sharp = require("sharp");
const jetpack = require("fs-jetpack");
const async = require("async");

const imageDir = jetpack.dir("src/assets/images/landing");
const images = imageDir
  .list()
  .map((file) => file.split("."))
  .filter(([_, format]) => format === "jpg")
  .map((arr) => arr[0].split("-"))
  .filter((arr) => arr.length === 2)
  .map((data) => ({
    id: data[0],
    aspect: {
      w: parseInt(data[1].split("x")[0]),
      h: parseInt(data[1].split("x")[1]),
    },
  }));

imageDir.write("info.json", images);

console.log(`Wrote info.json for the analyzed images.`);
console.log(`Found ${images.length} images.`);

const allTransformations = images.length * 3;
let completedTransformations = 0;

async.eachOfLimit(images, 5, async (image) => {
  await sharp(
    `src/assets/images/landing/${image.id}-${image.aspect.w}x${image.aspect.h}.jpg`
  ).toFile(
    `src/assets/images/landing/${image.id}-${image.aspect.w}x${image.aspect.h}.avif`
  );
  console.log(
    `${Math.round(
      (++completedTransformations / allTransformations) * 100
    )}% - Transcoded ${image.id}`
  );
  await sharp(
    `src/assets/images/landing/${image.id}-${image.aspect.w}x${image.aspect.h}-xs.jpg`
  ).toFile(
    `src/assets/images/landing/${image.id}-${image.aspect.w}x${image.aspect.h}-xs.avif`
  );
  console.log(
    `${Math.round(
      (++completedTransformations / allTransformations) * 100
    )}% - Transcoded ${image.id} (xs)`
  );
  await sharp(
    `src/assets/images/landing/${image.id}-${image.aspect.w}x${image.aspect.h}-xl.jpg`
  ).toFile(
    `src/assets/images/landing/${image.id}-${image.aspect.w}x${image.aspect.h}-xl.avif`
  );
  console.log(
    `${Math.round(
      (++completedTransformations / allTransformations) * 100
    )}% - Transcoded ${image.id} (xl)`
  );
});

console.log(`All images looped over`);
