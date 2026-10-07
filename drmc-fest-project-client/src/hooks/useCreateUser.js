import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
const useCreateUser = () => {
    const { mutateAsync: userAsync } = useMutation({
        mutationFn: async ({ data, token }) => {
            const res = await axios.patch("http://localhost:5000/user", data, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return res.data
        },
        onSuccess: async (data) => {
            console.log(data)
        }
    })
    return userAsync
};

export default useCreateUser;