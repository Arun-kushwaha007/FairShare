import { Snackbar } from 'react-native-paper';
import { useToastStore } from '../../store/toastStore';

export function GlobalToast() {
  const { visible, message, hide } = useToastStore();
  return <Snackbar visible={visible} onDismiss={hide}>{message}</Snackbar>;
}
