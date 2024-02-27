import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url'
export async function processImageURL(obj) {
    const promises = [] as any;

    if (!obj.images) {
        return Promise.resolve(obj);
    }

    for (let key in obj.images) {
        if (obj.images.hasOwnProperty(key) && (typeof obj.images[key] === 'string') && (obj.images[key].startsWith('http://') || obj.images[key].startsWith('https://'))) {
            const base64data = await getImageData(obj.images[key]);

            if (base64data) {
                promises.push({ key, base64data });
            }
        }
    }

    try {
        const results = await Promise.all(promises);

        const modifiedObj = { ...obj };

        results.forEach((result) => {
            modifiedObj.images[result.key] = result.base64data;
        });

        return modifiedObj;
    } catch (error) {
        console.error('发生错误:', error);
        return obj;
    }
}

const currentModuleUrl = import.meta.url;
const tempFolderPath = path.resolve(fileURLToPath(currentModuleUrl), '../../temp')
if (!fs.existsSync(tempFolderPath)) {
    fs.mkdirSync(tempFolderPath, { recursive: true });
}
async function getImageData(imageUrl) {
    try {
        const imageFileName = getImageFileName(imageUrl);
        const imagePath = path.join(tempFolderPath, imageFileName);

        if (fs.existsSync(imagePath)) {
            console.log(`Image found in cache: ${imagePath}`);
            return imagePath; // Return cached image path if available
        }

        const response = await fetch(imageUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${imageUrl}`);
        }

        const buffer = await response.arrayBuffer();
        const base64data = `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`;
        console.log(base64data.slice(0, 20));

        // Save the fetched image to the temporary folder
        fs.writeFileSync(imagePath, Buffer.from(buffer));

        return base64data;
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
}

function getImageFileName(imageUrl) {
    // Generate a unique hash for the image URL to use as the file name
    const hash = crypto.createHash('md5').update(imageUrl).digest('hex');
    return `${hash}.jpg`; // Using '.jpg' extension for example, adjust based on the image type
}

