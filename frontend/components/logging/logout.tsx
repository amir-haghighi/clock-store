
import toast from 'react-hot-toast';
import { Button } from '../ui/button'
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLogout } from '@/hooks/useLogout';

export function Logout() {
    const { mutate: logout } = useLogout()
    const onLogoutHandle = async () => {
        logout(undefined, {
            onSuccess: (data) => {
                toast.success(data.message);
            },

            onError: (err: any) => {
                toast.error(err.message);
            }
        });
    }
    return (
        <Button onClick={onLogoutHandle}>
            log out
        </Button>
    )
}

export default Logout