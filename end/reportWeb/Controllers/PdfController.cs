
using System.Collections.Generic;
using System.IO;
using System.Linq;
using iText.IO.Font;
using iText.Kernel.Font;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using CellReport.exporter;
using Microsoft.AspNetCore.Authorization;
using System.Collections;
using iText.Layout.Borders;
using iText.Kernel.Colors;
using System;
using iText.Layout.Properties;
using iText.Html2pdf;
using iText.Layout.Font;

namespace reportWeb.Controllers
{
    public class PdfController : Controller
    {
        [HttpPost]
        [AllowAnonymous]
        public IActionResult Index(string report_obj, string paperSetting)
        {
            
            PageSetup ps = null;
            if (!string.IsNullOrEmpty(paperSetting) && "undefined" != paperSetting)
                ps = JsonSerializer.Deserialize<PageSetup>(paperSetting);
            //var report_str = System.IO.File.ReadAllText(@"C:\Users\Administrator\Desktop\Untitled-1.json");
            return File(buildPdf(report_obj, ps), "application/pdf");
        }

        public static byte[] buildPdf(string report_str, PageSetup ps)
        {
            var json_root = JsonDocument.Parse(report_str).RootElement;
            var json_data = json_root.GetProperty("data");
            //https://api.itextpdf.com/iText7/dotnet/latest/classi_text_1_1_layout_1_1_element_1_1_area_break.html
            var grid_list = json_data.EnumerateObject().Select(x => x.Name).ToList();
            if (ps == null)
            {
                if (json_data.GetProperty(grid_list[0]).TryGetProperty("paperSetting", out var paperSetting_str)
                    && paperSetting_str.GetString() != null
                    )
                {
                    ps = JsonSerializer.Deserialize<PageSetup>(paperSetting_str.GetString());
                }
                else
                    ps = new PageSetup();
            }
            if (ps.pageSize_name != "自定义")
            {
                PageSize _PageSize = typeof(PageSize).GetField(ps.pageSize_name.ToUpper()).GetValue(null) as PageSize;
                if (ps.orientation == "landscape")
                    _PageSize = _PageSize.Rotate();
                ps.pageSize_Width = _PageSize.GetWidth();
                ps.pageSize_Height = _PageSize.GetHeight();
            }

            MemoryStream stream = new();
            PdfWriter writer = new(stream);
            PdfDocument pdf = new(writer);
            try
            {
                var default_font=CellReport.running.Template.getTemplate("template.xml").Get("FONT").content;
                default_font=json_root.GetProperty("defaultsetting").GetProperty("FONT").GetString();
                if (converterProperties == null)
                {
                    FontProvider fontProvider = new FontProvider(default_font);
                    fontProvider.AddSystemFonts();
                    converterProperties = new ConverterProperties();
                    converterProperties.SetFontProvider(fontProvider);
                    converterProperties.SetCharset("utf-8");
                    converterProperties.SetBaseUri("http://127.0.0.1:5000/");
                }
                Document pdf_doc = new(pdf, new PageSize(ps.pageSize_Width, ps.pageSize_Height)
                    , false);
                pdf_doc.SetMargins(ps.margin_top, ps.margin_right, ps.margin_bottom, ps.margin_left);
                PdfFont sysFont = PdfFontFactory.CreateRegisteredFont(default_font, PdfEncodings.IDENTITY_H, PdfFontFactory.EmbeddingStrategy.PREFER_EMBEDDED, true);
                pdf_doc.SetFont(sysFont).SetFontSize(11);//设置字体大小

                bool is_first = true;
                foreach (var item in json_data.EnumerateObject())
                {
                    var rg = new ReportGridJSON(item.Value, ps);
                    rg.output(pdf_doc,ref is_first, addTable);
                }
                add_header_footer(ps, pdf, pdf_doc);

                //*/
                pdf_doc.Flush();
            }
            finally
            {
                pdf.Close();//记得关闭PdfDocument和PdfWriter
                writer.Close();
            }
            return stream.ToArray();
        }

        private static ConverterProperties converterProperties = null;

        private static Paragraph convert_html_to_paragraph(string html)
        {
            var retpp = new Paragraph();
            var t_list=HtmlConverter.ConvertToElements(html, converterProperties);
            foreach (var one_ele in t_list)
            {
                retpp.Add(one_ele as IBlockElement);
            }
            return retpp;
        }
        private static Paragraph replace_var_to_Paragraph(string str, int page_no, int page_all)
        {//&[页码]&[总页数]&[日期]&[时间]
            var t = str.Replace("&[页码]", page_no.ToString())
                .Replace("&[总页数]", page_all.ToString())
                .Replace("&[日期]", DateTime.Today.ToString("yyyy-MM-dd"))
                .Replace("&[时间]", DateTime.Today.ToString("hh:ss:mm"))
                ;
            return convert_html_to_paragraph(t);
        }
        private static void add_header_footer(PageSetup ps, PdfDocument pdf, Document pdf_doc)
        {
            var pp = new Paragraph();
            int n = pdf.GetNumberOfPages();

            var water_mark = new Paragraph("CellReport").SetFontColor(ColorConstants.LIGHT_GRAY)
                .SetFontSize(40).SetOpacity(0.6f);
            for (int page_idx = 1; page_idx <= n; page_idx++)
            {
                //pdf_doc.ShowTextAligned(water_mark, ps.pageSize_Width / 2, ps.pageSize_Height / 2, page_idx, TextAlignment.CENTER,
                //   VerticalAlignment.MIDDLE, 120);

                if (!String.IsNullOrEmpty(ps.footer_left))
                {
                    pp = replace_var_to_Paragraph(ps.footer_left, page_idx, n);
                    pdf_doc.ShowTextAligned(pp, ps.margin_footer, ps.margin_footer, page_idx, TextAlignment.LEFT,
                   VerticalAlignment.BOTTOM, 0);//footer left BOTTOM
                }

                if (!String.IsNullOrEmpty(ps.footer_right))
                {
                    pp = replace_var_to_Paragraph(ps.footer_right, page_idx, n);
                    pdf_doc.ShowTextAligned(pp,
                    ps.pageSize_Width - ps.margin_footer, ps.margin_footer, page_idx, TextAlignment.RIGHT,
                    VerticalAlignment.BOTTOM, 0);//footer RIGHT BOTTOM
                }
                if (!String.IsNullOrEmpty(ps.header_left))
                {
                    pp = replace_var_to_Paragraph(ps.header_left, page_idx, n);
                    pdf_doc.ShowTextAligned(pp,
                  ps.margin_footer, ps.pageSize_Height - ps.margin_footer, page_idx, TextAlignment.LEFT,
                  VerticalAlignment.TOP, 0);//header left top
                }
                if (!String.IsNullOrEmpty(ps.header_right))
                {
                    pp = replace_var_to_Paragraph(ps.header_right, page_idx, n);
                    pdf_doc.ShowTextAligned(pp,
                  ps.pageSize_Width - ps.margin_footer, ps.pageSize_Height - ps.margin_footer, page_idx, TextAlignment.RIGHT,
                  VerticalAlignment.TOP, 0);//header right TOP
                }
                if (!String.IsNullOrEmpty(ps.header_center))
                {
                    pp = replace_var_to_Paragraph(ps.header_center, page_idx, n);
                    pdf_doc.ShowTextAligned(pp,
                   ps.pageSize_Width / 2, ps.pageSize_Height - ps.margin_footer, page_idx, TextAlignment.CENTER,
                   VerticalAlignment.TOP, 0); //header CENTER
                }
                if (!String.IsNullOrEmpty(ps.footer_center))
                {
                    pp = replace_var_to_Paragraph(ps.footer_center, page_idx, n);
                    pdf_doc.ShowTextAligned(pp,
                   ps.pageSize_Width / 2, ps.margin_footer, page_idx, TextAlignment.CENTER,
                   VerticalAlignment.BOTTOM, 0);//footer CENTER
                }
            }
        }

        private static Table addTable(ReportGridJSON rg, List<int> row_list, List<int> col_list)
        {
            List<BitArray> tableBitFlag = new();
            for (int i = 0; i < rg.tableData.Length; i++)
            {
                tableBitFlag.Add(new BitArray(rg.columnlenArr.Count));
            }
            var cols = new List<float>();
            foreach (var one in col_list)
            {
                cols.Add(rg.cols[one]);
            }
            float tbl_height = 0;
            foreach (var one in row_list)
            {
                tbl_height += rg.GetRowHeight(one);
            }
            var pdf_table = new Table(cols.ToArray())// 设置表格列数
                .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER);

            foreach (var rowNo in row_list)
            {
                var row = rg.tableData[rowNo];
                pdf_table.StartNewRow();
                foreach (var colNo in col_list)
                {
                    if (colNo >= row.Length)
                        continue;
                    var cell_value = row[colNo];
                    if (colNo >= rg.columnlenArr.Count)
                    {
                        break;
                    }
                    if (tableBitFlag[rowNo].Get(colNo))
                    {
                        continue;
                    }
                    tableBitFlag[rowNo].Set(colNo, true);
                    var max_height = rg.GetRowHeight(rowNo);

                    var max_width = rg.columnlenArr[colNo];
                    var r_c = rg.find_config_merge(rowNo, colNo);
                    int rowSpan = 1, colSpan = 1;
                    Cell pdf_cell;
                    bool is_lastcol_split_cell = false;
                    bool is_lastrow_split_cell = false;
                    if (r_c == null)
                    {
                        pdf_cell = new Cell();
                    }
                    else
                    {
                        if (r_c.rs > 1) rowSpan = r_c.rs;
                        if (r_c.cs > 1) colSpan = r_c.cs;
                        if (colNo + colSpan - 1 > col_list.Last())
                        {
                            colSpan = col_list.Last() - colNo + 1;
                            is_lastcol_split_cell = true;
                            rg.insert_merge(rowNo, colNo + colSpan, rowSpan, r_c.cs - colSpan);
                        }
                        if (rowNo + rowSpan - 1 > row_list.Last())
                        {
                            rowSpan = row_list.Last() - rowNo + 1;
                            is_lastrow_split_cell = true;
                            rg.insert_merge(rowNo + rowSpan, colNo, r_c.rs - rowSpan, colSpan);
                        }
                        pdf_cell = new Cell(rowSpan, colSpan);
                        max_width = 0;
                        for (var ci = 0; ci < colSpan; ci++)
                        {
                            max_width += rg.columnlenArr[colNo + ci];
                        }
                        max_height = 0;
                        for (var ri = 0; ri < rowSpan; ri++)
                        {
                            max_height += rg.GetRowHeight(rowNo + ri);
                            for (var ci = 0; ci < colSpan; ci++)
                            {
                                tableBitFlag[r_c.r + ri]?.Set(r_c.c + ci, true);
                            }
                        }
                    }
                    pdf_cell.SetBorder(Border.NO_BORDER);
                    foreach (var one_style in rg.find_style(rowNo, colNo))
                    {
                        switch (one_style.Key)
                        {
                            case "background-color":
                                pdf_cell.SetBackgroundColor(new DeviceRgb(System.Drawing.ColorTranslator.FromHtml(one_style.Value)));
                                break;
                            case "color":
                                pdf_cell.SetFontColor(new DeviceRgb(System.Drawing.ColorTranslator.FromHtml(one_style.Value)));
                                break;
                            case "font-family":
                                //ret["font-family"] = one_pair[1];
                                break;
                            case "FONT-SIZE":
                                pdf_cell.SetFontSize(float.Parse(one_style.Value));
                                break;
                            case "font-weight":
                                pdf_cell.SetBold();
                                break;
                            case "BORDER-LEFT":
                                var border_style = (one_style.Value as String).Split();
                                pdf_cell.SetBorderLeft(new SolidBorder(
                                     new DeviceRgb(System.Drawing.ColorTranslator.FromHtml(border_style[1]))
                                    , float.Parse(border_style[0])));
                                break;
                            case "BORDER-RIGHT":
                                if (!is_lastcol_split_cell)
                                {
                                    border_style = (one_style.Value as String).Split();
                                    pdf_cell.SetBorderRight(new SolidBorder(
                                         new DeviceRgb(System.Drawing.ColorTranslator.FromHtml(border_style[1]))
                                        , float.Parse(border_style[0])));
                                }
                                break;
                            case "BORDER-TOP":
                                border_style = (one_style.Value as String).Split();
                                pdf_cell.SetBorderTop(new SolidBorder(
                                     new DeviceRgb(System.Drawing.ColorTranslator.FromHtml(border_style[1]))
                                    , float.Parse(border_style[0])));
                                break;
                            case "BORDER-BOTTOM":
                                if (!is_lastrow_split_cell)
                                {
                                    border_style = (one_style.Value as String).Split();
                                    pdf_cell.SetBorderBottom(new SolidBorder(
                                         new DeviceRgb(System.Drawing.ColorTranslator.FromHtml(border_style[1]))
                                        , float.Parse(border_style[0])));
                                }
                                break;
                            case "vertical-align":
                                switch (one_style.Value.ToString().ToUpper())
                                {
                                    case "TOP":
                                        pdf_cell.SetVerticalAlignment(VerticalAlignment.TOP);
                                        break;
                                    case "BOTTOM":
                                        pdf_cell.SetVerticalAlignment(VerticalAlignment.BOTTOM);
                                        break;
                                    default:
                                        pdf_cell.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                                        break;
                                }

                                break;
                            case "text-align":
                                switch (one_style.Value.ToString().ToUpper())
                                {
                                    case "LEFT":
                                        pdf_cell.SetTextAlignment(TextAlignment.LEFT);
                                        break;
                                    case "RIGHT":
                                        pdf_cell.SetTextAlignment(TextAlignment.RIGHT);
                                        break;
                                    default:
                                        pdf_cell.SetTextAlignment(TextAlignment.CENTER);
                                        break;
                                }

                                break;
                        }
                    }
                    int deta = 0;
                    IBlockElement cur_pp = null;
                    var cur_str = cell_value == null ? "" : cell_value.ToString();
                    if (cur_str.StartsWith("<"))
                    {
                        var t_list = HtmlConverter.ConvertToElements($"<div style='width:{max_width}pt;height:{max_height}pt'>{cur_str}</div>", converterProperties);
                        if (t_list.Count == 1 && t_list[0] is IBlockElement)
                            cur_pp = t_list[0] as IBlockElement;
                        else
                            cur_pp = new Paragraph(cur_str);
                    }
                    else
                    {
                        cur_pp = new Paragraph(cur_str);
                    }
                    pdf_cell.Add(cur_pp)
                            //replace_var_to_Paragraph(cell_value.ToString(),0,0)
                            .SetMinWidth(max_width - deta).SetMaxWidth(max_width - deta)
                            .SetMinHeight(max_height - deta).SetMaxHeight(max_height - deta)
                            .SetPadding(0)// 不设置为0 ，将导致高度和设置的不同 缺省padding =2
                                          //.SetMargin(2)

                            ;

                    pdf_table.AddCell(pdf_cell);
                }
            }

            return pdf_table;
        }
    }
}
