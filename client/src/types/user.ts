export interface CurrentUser {
  id: string;
  username: string;
  primaryContact: string;
  otherContact?: string | null;
  profilePicUrl?: string | null;
  isVerified: boolean;
  status: string;
  createdAt: string;
}
