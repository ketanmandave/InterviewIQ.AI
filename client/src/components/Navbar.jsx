import React, {useState} from 'react'
import { useSelector } from 'react-redux'
import motion from 'motion/react'
import { BsRobot, BsCoin } from 'react-icons/bs'
import { HiOutlineLogout } from 'react-icons/hi'
import { FaUserAstronaut } from 'react-icons/fa'


const Navbar = () => {
    const { userData } = useSelector((state) => state.user);

    const [showCreditPopup, setShowCreditPopup] = useState(false);
    cons
    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    <div>
                        <BsRobot size={18} />
                    </div>
                    <h1>InterviewIQ.AI</h1>
                </div>

                <div>
                    <div>
                        <button>
                            <BsCoin size={20} />
                            {userData?.credits || 0}
                        </button>on

                    </div>
                    <div>
                        <button> 
                            {userData ? userData?.name.slice(0, 1).toUpperCase() : <FaUserAstronaut size={16} />}
                        </button>
                    </div>
                </div>

            </motion.div>
        </div>
    )
}

export default Navbar