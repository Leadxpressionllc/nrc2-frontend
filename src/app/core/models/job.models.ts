export interface Job {
  title: string;
  date: Date;
  url: string;
  company: string;
  city: string[];
  description: string;
  price: string;
  preview: number;
  id: string;
  ad_type: string;
  major_category0: string;
  minor_category0: string;
  logo_url: string;
}

export interface JobResponse {
  count: number;
  start: number;
  total: number;
  jobs: Job[];
}
