import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

type Time = {
	hours: number;
	minutes: number;
	seconds: number;
};

const DEFAULT_TIME = 10; // seconds

export default function App() {
	const timerRef = useRef();
	const [seconds, setSeconds] = useState<number>(DEFAULT_TIME);
	const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
	const [time, setTime] = useState<Time>({
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	const secondsToTime = (secs: number) => {
		const hours = Math.floor(secs / (60 * 60));

		const divisor_for_minutes = secs % (60 * 60);
		const minutes = Math.floor(divisor_for_minutes / 60);

		const divisor_for_seconds = divisor_for_minutes % 60;
		const seconds = Math.ceil(divisor_for_seconds);

		const obj = {
			hours,
			minutes,
			seconds,
		};
		return obj;
	};

	useEffect(() => {
		let timeLeftVar = secondsToTime(seconds);
		setTime(timeLeftVar);
	}, []);

	useEffect(() => {
		// Check if we're at zero.
		if (seconds === 0) {
			clearInterval(timerRef.current);
			setSeconds((currentValue) => {
				setTime(secondsToTime(DEFAULT_TIME));
				return DEFAULT_TIME;
			});
			setIsTimerRunning(false);
		}
	}, [seconds]);

	const startTimer = () => {
		if (seconds > 0) {
			timerRef.current = setInterval(countDown, 1000);
			setIsTimerRunning(true);
		}
	};

	const pauseTimer = () => {
		setIsTimerRunning(false);
		clearInterval(timerRef.current);
	};

	const countDown = () => {
		// Remove one second, set state so a re-render happens.
		setSeconds((secondsRemaining) => {
			const newVal = secondsRemaining - 1;
			setTime(secondsToTime(newVal));
			return newVal;
		});
	};

	return (
		<View style={styles.container}>
			<View>
				<Text style={{ fontSize: 110, fontWeight: 'bold' }}>
					{time.minutes < 10 ? `0${time.minutes}` : time.minutes} :{' '}
					{time.seconds < 10 ? `0${time.seconds}` : time.seconds}
				</Text>
				<View style={{ margin: 10 }} />
				{isTimerRunning ? (
					<Button onPress={pauseTimer} title='Pause' />
				) : (
					<Button onPress={startTimer} title='Start' />
				)}
			</View>
			<StatusBar style='auto' />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
