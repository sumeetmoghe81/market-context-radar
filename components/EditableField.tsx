
import React, { useState, useEffect, useRef } from 'react';

const PencilIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

interface EditableFieldProps {
    value: string;
    onSave: (newValue: string) => void;
    inputClassName?: string;
    containerClassName?: string;
    as?: 'h1' | 'p';
}

const EditableField: React.FC<EditableFieldProps> = ({ value, onSave, inputClassName, containerClassName, as = 'p' }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);
    const Tag = as;

    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);
    
    const handleSave = () => {
        setIsEditing(false);
        onSave(currentValue.trim() || value); // Revert to original if saved value is empty
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            setCurrentValue(value);
            setIsEditing(false);
        }
    };
    
    if (isEditing) {
        return (
            <input
                ref={inputRef}
                type="text"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className={inputClassName} // The input styles are comprehensive
            />
        );
    }

    return (
        <div 
            className="group relative flex items-center gap-x-3 cursor-pointer"
            onClick={() => setIsEditing(true)}
        >
            <Tag className={containerClassName}>{value}</Tag>
            <div className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <PencilIcon />
            </div>
        </div>
    );
};

export default EditableField;
