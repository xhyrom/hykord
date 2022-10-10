export interface SelectedGuildStore {
    getGuildId(): string;
    getLastSelectedGuildId(): string;
    getLastSelectedTimestamp(): number;
    getState(): {
        selectedGuildTimestampMillis: Record<string, number>
    }
}