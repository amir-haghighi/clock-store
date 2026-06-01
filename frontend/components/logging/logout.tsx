
import toast from 'react-hot-toast';
import { Button } from '../ui/button'
import { useUser } from '@/hooks/useUser';
import { useLogout } from '@/hooks/useLogout';
import { LogOutIcon } from 'lucide-react';

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
        <Button onClick={onLogoutHandle} className='bg-muted text-foreground'>
            <span> Log out</span>
            <LogOutIcon />
        </Button>
    )
}

export default Logout