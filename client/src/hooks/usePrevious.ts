import { useRef, useEffect } from 'react';

type Props = {
    value: Object,
}

const usePrevious = (value: Props) => {
    const ref = useRef<Object | null>(null);;
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export default usePrevious;