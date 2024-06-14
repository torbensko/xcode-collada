import xml2js from "xml2js";

// Fix 0: avoid spaces in the names
// xml = xml.replace(/Celebration v2/g, "Celebration");
export const stringToXmlObject = async (xml: string): Promise<any> => {
  const parser = new xml2js.Parser();
  return new Promise((resolve, reject) => {
    parser.parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};
