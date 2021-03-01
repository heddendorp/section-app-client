const sharp = require("sharp");
const jetpack = require("fs-jetpack");

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

images.forEach((image) => {
  sharp(
    `src/assets/images/landing/${image.id}-${image.aspect.w}x${image.aspect.h}.jpg`
  ).toFile(
    `src/assets/images/landing/${image.id}-${image.aspect.w}x${image.aspect.h}.avif`
  );
  sharp(
    `src/assets/images/landing/${image.id}-${image.aspect.w}x${image.aspect.h}-xs.jpg`
  ).toFile(
    `src/assets/images/landing/${image.id}-${image.aspect.w}x${image.aspect.h}-xs.avif`
  );
  sharp(
    `src/assets/images/landing/${image.id}-${image.aspect.w}x${image.aspect.h}-xl.jpg`
  ).toFile(
    `src/assets/images/landing/${image.id}-${image.aspect.w}x${image.aspect.h}-xl.avif`
  );
});
