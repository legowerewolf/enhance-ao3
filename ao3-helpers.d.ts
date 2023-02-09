type HotkeyConfig = [string[] | Set<string>, () => void];

type NamedLink = { name: string; link: string };
interface WorkData {
	title: string;
	id: number;
	author: NamedLink;
	tags: Record<string, NamedLink[]>;
	status: {
		complete: boolean;
		chapters_complete: number;
		chapters_total: number;
	};
}

interface Document {
	AO3_work_data: WorkData;
}
