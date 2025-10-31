import { toast } from 'react-toastify';

export const getDeleteModalData = () => {
  return {
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  };
};

export const getConfirmationModalData = () => {
  return {
    title: 'Logout?',
    text: 'You are logging out!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Logout!',
  };
};

export const showSuccessToaster = (message: string) => {
  toast.success(message);
};

export const showErrorToaster = (error: string) => {
  toast.error(error);
};
