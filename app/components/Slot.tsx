'use client'
import { useState, useEffect, useRef } from 'react'
import HistoryModal from './HistoryModal'
import CsvUploader from './CsvLoader'
import { Dialog } from '@headlessui/react'

const NUM_SLOTS = 3 // Number of slots to display
const SPIN_DURATION = 3000 // Animation duration in milliseconds
const EXTRA_ITEMS = 5 // Add extra items to ensure smooth loop

interface CsvRow {
    // Define the expected structure of your CSV data here
    // For example:
    name: string
}

export default function SlotComponent() {
    const [customerList, setCustomerList] = useState<string[]>([
        'Test 1',
        'Test 2',
        // 'Test 3',
        // 'Test 4',
        // 'Test 5',
        // 'Test 6',
        // 'Test 7',
        // 'Test 8',
        // 'Test 9',
        // 'Test 10',
    ])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [winnerList, setWinnerList] = useState<string[]>([])
    const [csvData, setCsvData] = useState<CsvRow[]>([])
    const [spinning, setSpinning] = useState<boolean>(false)
    const [animationList, setAnimationList] = useState<string[]>([]) // State for animation list
    const slotRefs = useRef<HTMLParagraphElement[]>([])

    useEffect(() => {
        const drawer = document.getElementById('drawer')
        const overlay = document.getElementById('overlay')
        const drawerCloseButton = document.getElementById('drawer-close-button')

        function openDrawer() {
            drawer?.classList.remove('-translate-x-full')
            overlay?.classList.add('opacity-50')
            overlay?.classList.remove('pointer-events-none')
        }

        function closeDrawer() {
            drawer?.classList.add('-translate-x-full')
            overlay?.classList.remove('opacity-50')
            overlay?.classList.add('pointer-events-none')
        }

        const openDrawerButton = document.getElementById('openDrawerButton')
        if (openDrawerButton) {
            openDrawerButton.addEventListener('click', openDrawer)
        }

        if (drawerCloseButton) {
            drawerCloseButton.addEventListener('click', closeDrawer)
        }

        function handleClickOutside(event: MouseEvent) {
            if (
                drawer &&
                !drawer.contains(event.target as Node) &&
                openDrawerButton &&
                !openDrawerButton.contains(event.target as Node)
            ) {
                closeDrawer()
            }
        }

        window.addEventListener('click', handleClickOutside)

        // Clean up event listeners when the component unmounts
        return () => {
            if (openDrawerButton) {
                openDrawerButton.removeEventListener('click', openDrawer)
            }
            if (drawerCloseButton) {
                drawerCloseButton.removeEventListener('click', closeDrawer)
            }
            window.removeEventListener('click', handleClickOutside)
        }
    }, [])

    useEffect(() => {
        const generateAnimationList = (names: string[]): string[] => {
            const extendedList = shuffle([...names])
            // Calculate how many items are needed to fill the visible area
            const itemsNeeded = NUM_SLOTS + EXTRA_ITEMS
            while (extendedList.length < itemsNeeded) {
                extendedList.push(...shuffle([...names]))
            }
            return extendedList
        }

        slotRefs.current = slotRefs.current.slice(0, NUM_SLOTS)
        setAnimationList(generateAnimationList(customerList))
    }, [spinning, customerList])

    // csv handler
    const handleFileData = (data: CsvRow[]) => {
        setCsvData(data)
    }

    const onConfirmUseCSV = () => {
        setCsvData([])
        setWinnerList([])
        setCustomerList(csvData.map((d) => d.name))
    }

    // lucky draw handler

    const shuffle = (arr: string[]) => {
        const newArr = [...arr]

        // Fisher-Yates Shuffle Algorithm
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
        }

        return newArr
    }

    const startAnimation = () => {
        setSpinning(true)

        const slotHeight = slotRefs.current[0]?.clientHeight || 0
        const totalHeight = slotHeight * animationList.length

        slotRefs.current.forEach((slot) => {
            if (slot) {
                // Calculate randomOffset within the valid range
                const randomOffset = Math.floor(
                    Math.random() * (animationList.length - NUM_SLOTS)
                )

                slot.animate(
                    [
                        { transform: 'translateY(0)' }, // Start position
                        {
                            transform: `translateY(-${totalHeight}px)`,
                        }, // Scroll down beyond visible area
                        {
                            transform: `translateY(-${
                                randomOffset * slotHeight
                            }px)`, // Snap to random offset
                        },
                    ],
                    {
                        duration: SPIN_DURATION,
                        iterations: 1,
                        easing: 'ease-in-out',
                    }
                )
            }
        })

        setTimeout(() => {
            setSpinning(false)

            const winner =
                (customerList.length > 1
                    ? slotRefs.current.find((_, index) => index === 1)
                          ?.innerText
                    : slotRefs.current.find((_, index) => index === 0)
                          ?.innerText) || ''

            setWinnerList([...winnerList, winner])
            setCustomerList(customerList.filter((c) => c !== winner))
            openModal()
        }, SPIN_DURATION)
    }

    // modal

    const openModal = () => setIsModalOpen(true)
    const closeModal = () => setIsModalOpen(false)

    return (
        <div className='slot-machine relative'>
            <button
                id='openDrawerButton'
                className='fixed z-10 bottom-6 left-6 hover:bg-gray-700 focus:outline-none rounded-full shadow-md'
            >
                <svg
                    className='h-12 w-12'
                    xmlns='http://www.w3.org/2000/svg'
                    x='0px'
                    y='0px'
                    width='100'
                    height='100'
                    viewBox='0,0,300,150'
                >
                    <g
                        fill='#8389a0'
                        fillRule='nonzero'
                        stroke='none'
                        strokeWidth='1'
                        strokeLinecap='butt'
                        strokeLinejoin='miter'
                        strokeMiterlimit='10'
                        strokeDasharray=''
                        strokeDashoffset='0'
                        fontFamily='none'
                        fontWeight='none'
                        fontSize='none'
                        textAnchor='none'
                    >
                        <g transform='scale(5.12,5.12)'>
                            <path d='M47.16,21.221l-5.91,-0.966c-0.346,-1.186 -0.819,-2.326 -1.411,-3.405l3.45,-4.917c0.279,-0.397 0.231,-0.938 -0.112,-1.282l-3.889,-3.887c-0.347,-0.346 -0.893,-0.391 -1.291,-0.104l-4.843,3.481c-1.089,-0.602 -2.239,-1.08 -3.432,-1.427l-1.031,-5.886c-0.084,-0.478 -0.499,-0.828 -0.985,-0.828h-5.5c-0.49,0 -0.908,0.355 -0.987,0.839l-0.956,5.854c-1.2,0.345 -2.352,0.818 -3.437,1.412l-4.83,-3.45c-0.399,-0.285 -0.942,-0.239 -1.289,0.106l-3.887,3.887c-0.343,0.343 -0.391,0.883 -0.112,1.28l3.399,4.863c-0.605,1.095 -1.087,2.254 -1.438,3.46l-5.831,0.971c-0.482,0.08 -0.836,0.498 -0.836,0.986v5.5c0,0.485 0.348,0.9 0.825,0.985l5.831,1.034c0.349,1.203 0.831,2.362 1.438,3.46l-3.441,4.813c-0.284,0.397 -0.239,0.942 0.106,1.289l3.888,3.891c0.343,0.343 0.884,0.391 1.281,0.112l4.87,-3.411c1.093,0.601 2.248,1.078 3.445,1.424l0.976,5.861c0.079,0.481 0.496,0.834 0.985,0.834h5.5c0.485,0 0.9,-0.348 0.984,-0.825l1.045,-5.89c1.199,-0.353 2.348,-0.833 3.43,-1.435l4.905,3.441c0.398,0.281 0.938,0.232 1.282,-0.111l3.888,-3.891c0.346,-0.347 0.391,-0.894 0.104,-1.292l-3.498,-4.857c0.593,-1.08 1.064,-2.222 1.407,-3.408l5.918,-1.039c0.479,-0.084 0.827,-0.5 0.827,-0.985v-5.5c0.001,-0.49 -0.354,-0.908 -0.838,-0.987zM25,32c-3.866,0 -7,-3.134 -7,-7c0,-3.866 3.134,-7 7,-7c3.866,0 7,3.134 7,7c0,3.866 -3.134,7 -7,7z'></path>
                        </g>
                    </g>
                </svg>
            </button>

            <button
                className='fixed z-10 bottom-6 right-6 hover:bg-gray-700 focus:outline-none rounded-full shadow-md'
                onClick={openModal}
            >
                History
            </button>

            <HistoryModal isOpen={isModalOpen} onClose={closeModal}>
                {winnerList.length > 0 ? (
                    <>
                        <Dialog.Title>History</Dialog.Title>
                        <Dialog.Description>
                            <p>
                                Congratulation! Khun{' '}
                                {winnerList[winnerList.length - 1]}.
                            </p>
                            <ul className='list-disc pl-5'>
                                {winnerList.map((item, index) => (
                                    <li key={index}>
                                        {index + 1}. {item}
                                    </li>
                                ))}
                            </ul>
                        </Dialog.Description>
                    </>
                ) : (
                    <Dialog.Title>No Data.</Dialog.Title>
                )}
                <button onClick={closeModal}>Close</button>
            </HistoryModal>

            <div
                className='fixed z-20 top-0 left-0 w-screen h-screen bg-gray-800 text-white transform -translate-x-full transition-transform duration-300 ease-in-out'
                id='drawer'
            >
                <div className='flex flex-col w-[50vw] p-3'>
                    <h3>Import Customer List</h3>
                    <CsvUploader onFileData={handleFileData} />
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {csvData.length > 0 &&
                                csvData.map((row, index) => (
                                    <tr key={`csv-${row.name}-${index}`}>
                                        {row.name}
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    <button onClick={onConfirmUseCSV}>Confirm</button>
                </div>

                <button
                    id='drawer-close-button'
                    className='absolute top-2 right-2 p-2 rounded-md hover:bg-gray-700 focus:outline-none'
                >
                    <svg
                        className='h-6 w-6 text-white'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M6 18L18 6M6 6l12 12'
                        />
                    </svg>
                </button>
                {/* ... Drawer Content ... */}
            </div>

            {/* lucky draw section */}
            <div className='bg-[#16213E] flex items-center justify-center min-h-screen'>
                <div className='slot-machine bg-[#0F3460] align-center rounded-[5px] p-4'>
                    <div className='slot-machine__slots relative w-[70vw] h-[143px] p-4 bg-[rgba(0,0,0,.2)] rounded-[5px] mb-2 overflow-hidden'>
                        <div className='absolute top-0 left-0 w-full h-full'>
                            {customerList.length > 0 &&
                                animationList.map((name, index) => (
                                    <p
                                        key={index}
                                        className={`flex items-center justify-center text-center h-[${Math.floor(
                                            100 / NUM_SLOTS
                                        )}%] leading-[3] transition-all duration-500 ${
                                            index % 2 !== 0 && !spinning
                                                ? 'bg-[rgba(0,0,0,.4)]'
                                                : '' // Add background to even items
                                        }`}
                                        ref={(el: HTMLParagraphElement) =>
                                            (slotRefs.current[index] = el)
                                        }
                                    >
                                        {name}
                                    </p>
                                ))}
                        </div>
                    </div>
                    <div className='flex flex-col items-center justify-center mt-4'>
                        <button
                            className='slot-machine__button w-[50vw] bg-[#5C2E7E] text-white uppercase font-bold py-2 px-4 rounded-[5px] hover:opacity-70'
                            onClick={startAnimation}
                            disabled={spinning || customerList.length == 1}
                        >
                            Spin
                        </button>
                        {customerList.length === 1 && (
                            <div>
                                <p className='text-red'>
                                    Can not press. This is the last one.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div
                id='log'
                className='max-w-[380px] text-white text-sm break-words'
            />
        </div>
    )
}
