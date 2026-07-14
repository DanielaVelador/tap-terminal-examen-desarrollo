export interface User {
  id: string;
  code?: string;
  name: string;
  email: string;
  phone?: string;
  profile_photo?: string;
  profile_ids?: string[];
  created_at?: string;
}