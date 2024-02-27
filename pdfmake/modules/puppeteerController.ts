import puppeteer, { Browser } from 'puppeteer';
import { Request, Response } from 'express';
import { printSchema } from '../zod';

let browserInstance: Browser;

async function getBrowserInstance() {
    if (!browserInstance) {
        browserInstance = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox','--disable-features=site-per-process'],
        });
    }
    return browserInstance;
}

async function printPage(req: Request, res: Response) {
    const browser = await getBrowserInstance();
    const page = await browser.newPage();
    try {
        const { url, selector, localStorageData, sessionStorageData, cookies } = req.body;

      
        const validationResult = printSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({ error: '数据格式不正确', details: validationResult.error });
            return
        }
    
        // Inject localStorage data
        if (localStorageData) {

            await page.evaluateOnNewDocument((localStorageData) => {
                console.log(localStorageData)
                for (const key in localStorageData) {
                    localStorage.setItem(key, JSON.stringify(localStorageData[key]));
                }
            }, localStorageData);
         
        }

        // Inject sessionStorage data
        if (sessionStorageData) {
            await page.evaluateOnNewDocument((sessionStorageData) => {
                for (const key in sessionStorageData) {
                    sessionStorage.setItem(key, sessionStorageData[key]);
                }
            }, sessionStorageData);
        }

        // Set cookies
        if (cookies) {
            await page.setCookie(...cookies);
        }

        // Set page configuration and perform actions
        await page.setViewport({ width: 1920, height: 1080 });
        // const waitForNavigationPromise = page.waitForNavigation({ waitUntil: 'networkidle0' })
        await page.goto(url,{waitUntil:'networkidle0'});



        // Wait for a specific element to load
        if (selector) {
            await page.waitForSelector(selector);
        } 
        // else {
        //     await waitForNavigationPromise
        // }

        // Generate PDF
        const pdfBuffer = await page.pdf({ path: './temp.pdf', printBackground: true, scale: 0.5 });

        // Close the page but keep the browser open
        await page.close();

        // Send the generated PDF to the client
        res.contentType('application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        await page.close();
        res.status(500).send(JSON.stringify({ error: error.message }));
    }
}

export const puppeteerController = { printPage };
