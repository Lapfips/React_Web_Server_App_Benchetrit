import { saveAs } from "file-saver";
import Papa from "papaparse";
import { PDFDocument, rgb } from "pdf-lib";
import React, { useState } from "react";
import "../css/Download.css";

const Download = () => {
  const [csvData, setCsvData] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);

  const togglePdfUrl = () => {
    setPdfUrl(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            setCsvData(results.data);
          },
        });
      };
      reader.readAsText(file);
    }
  };

  const createAndPreviewPDF = async () => {
    const jsonCsvFile = csvData;
    const totalHT = jsonCsvFile.reduce(
      (sum, item) => sum + item.quantite * item.prixUnitaire,
      0
    );
    const tva = totalHT * 0.2;
    const totalTTC = totalHT + tva;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);
    const { width, height } = page.getSize();

    page.drawText("Devis", {
      x: width / 2 - 50,
      y: height - 50,
      size: 20,
      color: rgb(0, 0, 0),
    });

    let yPosition = height - 80;
    jsonCsvFile.forEach((item) => {
      yPosition -= 20;
      page.drawText(
        `${item.description} - Quantité: ${item.quantite} - Prix unitaire: ${
          item.prixUnitaire
        }€ - Total: ${item.quantite * item.prixUnitaire}€`,
        { x: 50, y: yPosition, size: 12, color: rgb(0, 0, 0) }
      );
    });

    yPosition -= 40;
    page.drawText(`Total HT: ${totalHT.toFixed(2)}€`, {
      x: 50,
      y: yPosition,
      size: 12,
      color: rgb(0, 0, 0),
    });
    page.drawText(`TVA (20%): ${tva.toFixed(2)}€`, {
      x: 50,
      y: yPosition - 20,
      size: 12,
      color: rgb(0, 0, 0),
    });
    page.drawText(`Total TTC: ${totalTTC.toFixed(2)}€`, {
      x: 50,
      y: yPosition - 40,
      size: 12,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  const downloadPDF = () => {
    if (pdfUrl) {
      saveAs(pdfUrl, "devis.pdf");
    }
  };

  return (
    <div className="container-download">
      <div className="inputs-and-buttons">
        <input
          className="input-csv-file"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
        {!pdfUrl ? (
          <button onClick={createAndPreviewPDF}>Show PDF preview</button>
        ) : (
          <button onClick={togglePdfUrl}>Hide PDF preview</button>
        )}
        {pdfUrl && <button onClick={downloadPDF}>Download PDF</button>}
      </div>
      <div className="preview-pdf">{pdfUrl && <iframe src={pdfUrl} />}</div>
    </div>
  );
};

export default Download;
