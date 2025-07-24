import { PDFDownloadLink } from "@react-pdf/renderer";
import ItineraryPDF from "./ItineraryPDF";

interface ExportButtonProps {
    title: string;
    itinerary: Array<{
        day: string;
        activities: Array<{
            time: string;
            description: string;
        }>
    }>
}

const ExportButton = ({ title, itinerary }: ExportButtonProps) => (
    <PDFDownloadLink document={<ItineraryPDF title={title} itinerary={itinerary} />}
        fileName={`${title.replace(/\s+/g, '_')}.pdf`}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
    >
        {({ loading }) => (loading ? 'Generating...' : 'Export as PDF')}
    </PDFDownloadLink>
);

export default ExportButton;