import { User } from '../../../controllers';

export const getUser = async (req, res) => {
  try {
    const data = {
      data: { hash: req.params.user },
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: erorr.message });
  }
};

export const putUser = async (req, res) => {
  try {
    const data = {
      data: { hash: req.params.user },
      body: req.body,
    };

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    res.sendStatus(204);
    console.log(`deleted by hash: ${req.params.user}`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserRoles = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await new User();
    const data = await user.getUserRoles(userId);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
