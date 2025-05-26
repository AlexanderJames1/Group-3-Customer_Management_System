import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignIn({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                'http://localhost/CustomersManagementSystem/Backend/Administrator/SignIn.php',
                {
                    action: 'login',
                    email,
                    password
                },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (res.data.type === 'success') {
            const user = {
                customer_id: res.data.customer_id,
                customer_name: res.data.customer_name,
                email: res.data.email,
                token: res.data.token,
                phone: res.data.phone,
                address: res.data.address,
                profile_image: res.data.profile_image,
                loyalty_points: res.data.loyalty_points || 0,
                preference: res.data.preference || "",
                used_black_tier: res.data.used_black_tier || 0
            };

            localStorage.setItem('customer', JSON.stringify(user));

            if (user.preference) {
                const selected = user.preference.split(",").map(p => p.trim());
                localStorage.setItem(`onboarding_${user.email}`, JSON.stringify({ selectedCategories: selected }));
            }

            setUser(user); 
            navigate('/', { state: { customer_id: res.data.customer_id } });
        } else {
                setError(res.data.message);
            }
        } catch (err) {
            setError('Server error or CORS issue');
            console.error('Login error:', err);
        }
    };

    const handleSignUp = () => {
        navigate('/Sign-up');
    };

   return (
    <div className="mt-12 max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold mb-5 text-center text-gray-800">Welcome Back</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition duration-200"
        >
            Sign In
        </button>
        </form>

        <div className="text-sm text-center mt-5 text-gray-600">
        Don't have an account yet?
        </div>

        <button
        type="button"
        onClick={handleSignUp}
        className="mt-3 w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-200"
        >
        Create an Account
        </button>
    </div>
    );

}

export default SignIn;
