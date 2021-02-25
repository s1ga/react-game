interface BelarusMapProps {
    click: (e: React.MouseEvent<SVGPolygonElement>) => void
}

interface ControlPanelProps {
    clickHandler: (stateCase: string) => void,
    isAudioMuted: boolean,
    isMusicMuted: boolean
}

interface MenuProps {
    isOpen: boolean
    user: string
    onClose: () => void
    logout: () => void
}

interface BackdropProps {
    onClick: () => void
}

interface MenuToggleProps {
    onToggle: () => void
    isOpen: boolean
}

export type {
    BelarusMapProps, ControlPanelProps, MenuProps,
    BackdropProps, MenuToggleProps
}