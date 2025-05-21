import * as services from "../services";

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log({email, password});
        if (!email || !password) {
            return res.status(400).json({
                mes: 'Missing email or password',
                err: -1
            })
        }
        const response = await services.register(req.body);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: -1
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log({email, password});
        if (!email || !password) {
            return res.status(400).json({
                mes: 'Missing email or password',
                err: -1
            })
        }
        const response = await services.login(req.body);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            error: -1
        })
    }
}