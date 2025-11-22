/**
 * EditProfileModal
 * ----------------
 * Modal for editing user profile information.
 */

import { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import "./EditProfileModal.css";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
    const { user, updateUser } = useUser();
    const [name, setName] = useState(user.name);
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);

    useEffect(() => {
        if (isOpen) {
            setName(user.name);
            setAvatarUrl(user.avatarUrl);
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser({ name, avatarUrl });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Edit Profile</h2>
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Profile Picture</label>
                        <div className="avatar-upload-container">
                            <img
                                src={avatarUrl}
                                alt="Profile Preview"
                                className="avatar-preview"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/150";
                                }}
                            />
                            <div className="file-input-wrapper">
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setAvatarUrl(reader.result as string);
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="file-input"
                                />
                                <label htmlFor="avatar-upload" className="file-input-label">
                                    Choose Image
                                </label>
                            </div>
                        </div>
                        <div className="url-input-toggle">
                            <span className="separator">or</span>
                            <input
                                type="url"
                                id="avatarUrl"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                placeholder="Enter image URL"
                                className="url-input"
                            />
                        </div>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="cancel-button" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="save-button">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
