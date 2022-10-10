export interface SelectedGuildStore {
    getGuildId(): string;
    getLastSelectedGuildId(): string;
    getLastSelectedTimestamp(): number;
    getState(): {
        selectedGuildTimestampMillis: Record<string, number>
    }
}

export interface InviteStore {
    getCategory(): any;
    getChannel(): any;
    getFormState(): any;
    getInvites(): any;
    getProps(): any;
    getSection(): any;
    hasChanges(): any;
    initialize(): any;
    isOpen(): any;
    showNotice(): any;
}