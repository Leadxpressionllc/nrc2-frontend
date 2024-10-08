export interface PopupData {
  heading: string;
  message: string;
  type: 'alert' | 'confirm';
  successButtonText?: string;
  failureButtonText?: string;
  okButtonText?: string;
}

export interface PopupProps {
  backdrop?: string | boolean;
  keyboard?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  class?: string;
}
