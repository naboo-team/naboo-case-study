import { useCallback } from "react";
import { atom, useRecoilState } from "recoil";

export const debugModeAtom = atom({
    key: "debugMode",
    default: false,
})

export function useDebugMode() {
    const [isDebugMode, setIsDebugMode] = useRecoilState(debugModeAtom);
    const toggleDebugMode = useCallback(() => setIsDebugMode(!isDebugMode), [isDebugMode, setIsDebugMode])

    return [isDebugMode, toggleDebugMode] as const
}