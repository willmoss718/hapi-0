import { FILES } from "@/assets/files";
import { getCsvData } from "@/lib/server-utils";
import neatCsv from "neat-csv";
import { redirect } from "next/navigation";

export default async function PolicyPage({ params }: { params: Promise<{ policy: string }> }) {
    const { policy } = await params;
    const decodedPolicy = decodeURIComponent(policy);

    const allCsvFiles = await Promise.all(FILES.map((file) => getCsvData(file.path))).then((files) => files.filter((file) => file != null));
    const allCsvData = await Promise.all(allCsvFiles.map((csv) => neatCsv(csv))).then((data) => data.flat());
    const targetRow = allCsvData.find((row) => Object.values(row).some((value) => value === decodedPolicy));
    if (!targetRow) {
        return redirect('/');
    }

    return (
        <pre>{JSON.stringify(targetRow, null, 2)}</pre>
    );
}