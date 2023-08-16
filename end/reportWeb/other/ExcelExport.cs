using OfficeOpenXml;
using OfficeOpenXml.Style;
using OfficeOpenXml.Table;
using System.Collections.Generic;
using System.IO;

namespace reportWeb.other
{
    public class Export
    {
        static internal void Excel(CellReport.running.Report report, string file_name)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            // 创建ExcelPackage
            using (ExcelPackage excelPackage = new ExcelPackage(file_name))
            {
                ExcelWorkbook workbook = excelPackage.Workbook;
                foreach(var  one  in report.getGridList())
                {
                    var cur_grid=(one as CellReport.cell.ReportGrid);
                    ExcelWorksheet worksheet = workbook.Worksheets.Add(cur_grid.Title);
                    int row = 0;
                    // 写入数据
                    foreach (var rowData in cur_grid.exportLines())
                    {
                        for (int col = 0; col < rowData.Count; col++)
                        {
                            object cellData = rowData[col];
                            worksheet.Cells[row + 1, col + 1].Value = cellData;
                        }
                        row++;
                    }
                }
                // 保存ExcelPackage到流中
                excelPackage.Save();
            }
        }
    }
}
