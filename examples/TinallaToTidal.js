/*
once $ s "cp"
[ /play2, cps, 0.5625, cycle, 0.0, delta, 1.777777671814, s, cp ]

once $ "cp cp" 
[ /play2, cps, 0.5625, cycle, 0.0, delta, 0.88888883590698, s, cp ]
[ /play2, cps, 0.5625, cycle, 0.5, delta, 0.88888883590698, s, cp ]

once $ "cp cp cp cp"
[ /play2, cps, 0.5625, cycle, 0.0, delta, 0.44444465637207, s, cp ]
[ /play2, cps, 0.5625, cycle, 0.25, delta, 0.44444417953491, s, cp ]
[ /play2, cps, 0.5625, cycle, 0.5, delta, 0.44444465637207, s, cp ]
[ /play2, cps, 0.5625, cycle, 0.75, delta, 0.44444417953491, s, cp ]

once $ s "cp cp cp cp" # up "-2"
[ /play2, cps, 0.5625, cycle, 0.0, delta, 0.44444465637207, note, -2.0, s, cp ]
[ /play2, cps, 0.5625, cycle, 0.25, delta, 0.44444417953491, note, -2.0, s, cp ]
[ /play2, cps, 0.5625, cycle, 0.5, delta, 0.44444465637207, note, -2.0, s, cp ]
[ /play2, cps, 0.5625, cycle, 0.75, delta, 0.44444417953491, note, -2.0, s, cp ]

once $ s "cp cp cp cp" # room "2"
[ /play2, cps, 0.5625, cycle, 0.0, delta, 0.44444465637207, room, 2.0, s, cp ]
[ /play2, cps, 0.5625, cycle, 0.25, delta, 0.44444417953491, room, 2.0, s, cp ]
[ /play2, cps, 0.5625, cycle, 0.5, delta, 0.44444465637207, room, 2.0, s, cp ]
[ /play2, cps, 0.5625, cycle, 0.75, delta, 0.44444417953491, room, 2.0, s, cp ]

once $ s "[cp, cp]"
[ /play2, cps, 0.5625, cycle, 0.0, delta, 1.777777671814, s, cp ]
[ /play2, cps, 0.5625, cycle, 0.0, delta, 1.777777671814, s, cp ]

once $ s "cp(5,8)"

[ /play2, cps, 0.5625, cycle, 0.0, delta, 0.22222232818604, s, cp ]
[ /play2, cps, 0.5625, cycle, 0.25, delta, 0.22222185134888, s, cp ]
[ /play2, cps, 0.5625, cycle, 0.375, delta, 0.22222232818604, s, cp ]
[ /play2, cps, 0.5625, cycle, 0.625, delta, 0.22222232818604, s, cp ]
[ /play2, cps, 0.5625, cycle, 0.75, delta, 0.22222185134888, s, cp ]

d1 $ s "drum"
[ /play2, cps, 0.5625, cycle, 5.0, delta, 1.777777671814, s, drum ]
*/
/*
1.777777671814 
0.88888883590698,
0.88888883590698
*/
