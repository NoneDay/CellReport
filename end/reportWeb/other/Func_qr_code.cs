using CellReport.core.expr;
using System;
using System.Collections.Generic;
using System.Collections;
using System.Security.Cryptography;
using ZXing.QrCode;
using System.IO;
using ZXing;
using System.Drawing;

namespace CellReport.function
{
	public class Func_qr_code : FunctionUnit
	{
		public override Object calculate(IList args)
		{
            String BarcodeFormat = "QR_CODE";
            int width = 250;
            int height = 250;
            Object result_obj ;
            String qrText;
            
            switch (args.Count)
            {
                case 4:
                    result_obj = calcExpr(args[3]);
                    height = int.Parse(result_obj.ToString());
                    goto case 3;
                case 3:
                    result_obj = calcExpr(args[2]);
                    width = int.Parse(result_obj.ToString());
                    goto case 2;
                case 2:
                    BarcodeFormat = calcExpr(args[1]).ToString();
                    if (args.Count < 3 && BarcodeFormat != "QR_CODE")
                    {
                        width = 300;
                        height = 60;
                    }
                    goto case 1;
                case 1:
                    result_obj = calcExpr(args[0]);
                    qrText = result_obj.ToString();
                    break;
                default:
                    throw new CellReport.core.ReportRuntimeException("参数不对！");
            }
            
            if (BarcodeFormat != "QR_CODE")
                return "<img style='width:100%;height:100%' src='data:image/png;base64," + qr_code(qrText, BarcodeFormat,  width ,  height) +"'>";
            else
                return "<img style='object-fit:contain;width:100%;height:100%' src='data:image/png;base64," + qr_code(qrText, BarcodeFormat, width, height) + "'>";
        }
        public static string qr_code(string qrText,String BarcodeFormat= "CODE_128", int width=250,int height=250)
        {
            Byte[] byteArray;
            var margin = 0;
            ZXing.BarcodeFormat BarcodeFormat_type;
            if (!Enum.TryParse<ZXing.BarcodeFormat>(BarcodeFormat,out BarcodeFormat_type)){
                throw new core.ReportRuntimeException("没有你选择的类型："+ BarcodeFormat);
            }
            var qrCodeWriter = new ZXing.BarcodeWriterPixelData
            {
                Format = BarcodeFormat_type,
                Options = new QrCodeEncodingOptions
                {
                    Height = height,
                    Width = width,
                    Margin = margin
                }
            };
            var pixelData = qrCodeWriter.Write(qrText);

            // creating a bitmap from the raw pixel data; if only black and white colors are used it makes no difference
            // that the pixel data ist BGRA oriented and the bitmap is initialized with RGB
            using (var bitmap = new System.Drawing.Bitmap(pixelData.Width, pixelData.Height, System.Drawing.Imaging.PixelFormat.Format32bppRgb))
            {
                using (var ms = new MemoryStream())
                {
                    var bitmapData = bitmap.LockBits(new System.Drawing.Rectangle(0, 0, pixelData.Width, pixelData.Height), System.Drawing.Imaging.ImageLockMode.WriteOnly, System.Drawing.Imaging.PixelFormat.Format32bppRgb);
                    try
                    {
                        // we assume that the row stride of the bitmap is aligned to 4 byte multiplied by the width of the image
                        System.Runtime.InteropServices.Marshal.Copy(pixelData.Pixels, 0, bitmapData.Scan0, pixelData.Pixels.Length);
                    }
                    finally
                    {
                        bitmap.UnlockBits(bitmapData);
                    }
                    // save to stream as PNG
                    bitmap.Save(ms, System.Drawing.Imaging.ImageFormat.Png);
                    byteArray = ms.ToArray();
                }
            }
            return Convert.ToBase64String(byteArray);
        }
    }

}
