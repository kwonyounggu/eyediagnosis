export type DiagnosedRecord =
{
	queryId: number;
	age: number;
	gender: string;
	medicalHistory: string;
	symptoms: string;
	signs: string;
	chatGptResponse: string;
	queryDate: number;
	queryUserId: number; //foregin key 
}
