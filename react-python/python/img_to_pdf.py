import base64
from io import BytesIO

import arrow
from PIL import Image as PImage
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import SimpleDocTemplate, Image

PAGE_HEIGHT = A4[1]
PAGE_WIDTH = A4[0]
song = "simsun"
pdfmetrics.registerFont(TTFont(song, "SimSun.ttf"))

def base64_to_image(base64_string, output_path):
    try:
        base64_data = base64_string.split(',')[1]
        # 解码Base64字符串为字节数据
        image_data = base64.b64decode(base64_data)
        # file = open(output_path, 'wb')
        # file.write(image_data)
        # file.close()
        # 创建PIL图像对象
        image = PImage.open(BytesIO(image_data))

        # 保存图像到指定路径
        image.save(output_path)
        print(f"图像已保存到 {output_path}")
        return output_path
    except Exception as e:
        print(f"出现错误：{e}")


def image_cv(path, img_height_config):
    image = PImage.open(path)
    print(image.size)
    width = image.size[0]
    result = []
    cur_height = 0
    i = 0
    for img_height in img_height_config:
        cur_height += 1
        crop = image.crop((0, cur_height, width, cur_height + img_height))
        save_path = f"temp/temp{i}.png"
        i += 1
        crop.save(save_path)
        result.append({
            "width": width,
            "height": img_height,
            "path": save_path
        })
        cur_height = cur_height + img_height
    return result


def image_to_pdf(images_info, pdf_path):
    # 打开图片
    images = list()
    for i in images_info:
        # A4标准宽高为 21cm * 29.7cm
        image = Image(i["path"])
        image.drawWidth = 21 * cm  # 设置图片的宽度
        image.drawHeight = i["height"]/i["width"] * 21 * cm  # 设置图片的高度
        images.append(image)

    # 设置页面大小
    doc = SimpleDocTemplate(pdf_path, pagesize=A4)
    doc.topMargin = 0
    doc.bottomMargin = 0
    doc.leftMargin = 0
    doc.rightMargin = 0

    # 添加图片到PDF
    doc.build(images)
    # doc.build(images, onFirstPage=my_first_pages, onLaterPages=my_later_pages)


def draw_page_info(c: Canvas):
    """绘制页眉"""
    c.setFillColor(colors.aliceblue)
    c.rect(0, PAGE_HEIGHT-50, PAGE_WIDTH, 50, stroke=0, fill=True)
    c.setFont(song, 8)
    c.setFillColor(colors.black)
    c.drawString(PAGE_WIDTH - 105, PAGE_HEIGHT - 30, f"长安UNI-V")
    """绘制页脚"""
    timestamp = arrow.now()
    formatted_time = timestamp.format("YYYY-MM-DD")
    # 设置边框颜色
    c.setStrokeColor(colors.dimgrey)
    # 绘制线条
    c.line(30, PAGE_HEIGHT - 790, 570, PAGE_HEIGHT - 790)
    # 绘制页脚文字
    c.setFont(song, 8)
    c.setFillColor(colors.black)
    c.drawString(PAGE_WIDTH - 105, PAGE_HEIGHT - 810, f"长安UNI-V {formatted_time}")


def my_first_pages(c: Canvas, doc):
    c.saveState()
    # 绘制页眉页脚
    draw_page_info(c)
    c.restoreState()


def my_later_pages(c: Canvas, doc):
    c.saveState()
    # 绘制页眉页脚
    draw_page_info(c)
    c.restoreState()


if __name__ == '__main__':
    with open("a.txt", "r") as f:
        content = f.read()

    img_path = base64_to_image(content, 'img2.png')
    img_config = [2532, 1660, 2287, 1742, 2514, 1468, 2293, 1888]
    images_info = image_cv(img_path, img_config)
    pdf_path = 'output.pdf'  # 替换成想要保存的PDF文件路径
    image_to_pdf(images_info, pdf_path)
