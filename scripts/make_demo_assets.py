#!/usr/bin/env python3
"""Create original CC0 demo SVGs and synthesized WAVs using only Python stdlib.

No samples, recordings, third-party compositions or private collections are used.
Run from any directory; files are written under this repository's assets/.
"""
from pathlib import Path
import array
import json
import math
import wave

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT / "assets" / "art"
AUDIO = ROOT / "assets" / "audio"
ART.mkdir(parents=True, exist_ok=True)
AUDIO.mkdir(parents=True, exist_ok=True)

def svg(body, background="#10263b"):
    return ('<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="700" viewBox="0 0 1000 700">'
            '<defs><radialGradient id="halo"><stop stop-color="#ffdd8a" stop-opacity=".8"/><stop offset="1" stop-color="#ffdd8a" stop-opacity="0"/></radialGradient>'
            '<linearGradient id="night" x2="0" y2="1"><stop stop-color="#101d36"/><stop offset="1" stop-color="#254b59"/></linearGradient></defs>'
            f'<rect width="1000" height="700" fill="{background}"/>{body}</svg>')

stars = ''.join(f'<circle cx="{(i*137+44)%980+10}" cy="{(i*79+17)%360+12}" r="{1+(i%3)*.45}" fill="#dfcca4" opacity="{.25+(i%4)*.13}"/>' for i in range(39))
branches = '<path d="M474 580Q500 436 473 315Q462 242 499 160M481 404Q363 379 281 278M478 343Q599 310 663 224M481 266Q398 231 355 164M487 467Q614 436 730 346" fill="none" stroke="#b7b095" stroke-width="9" stroke-linecap="round"/>'
lanterns=''
for x,y in [(280,294),(350,186),(392,290),(447,373),(505,186),(571,346),(653,245),(730,370),(606,447),(346,392),(420,470)]:
    lanterns+=f'<circle cx="{x}" cy="{y+28}" r="62" fill="url(#halo)" opacity=".6"/><path d="M{x} {y-15}v22" stroke="#d0bd86" stroke-width="2"/><ellipse cx="{x}" cy="{y+29}" rx="15" ry="22" fill="#e9b45e"/><ellipse cx="{x}" cy="{y+27}" rx="7" ry="17" fill="#ffe2a2"/>'
(ART/'lantern-orchard.svg').write_text(svg(f'<rect width="1000" height="700" fill="url(#night)"/>{stars}<circle cx="792" cy="111" r="38" fill="#dacdb0"/><path d="M0 526Q221 393 470 510T1000 489V700H0Z" fill="#376468"/><path d="M0 592Q276 495 554 583T1000 561V700H0Z" fill="#244e54"/>{branches}{lanterns}<path d="M0 669Q323 558 595 667T1000 613V700H0Z" fill="#123b44"/>'),encoding='utf-8')

moonbody=f'{stars}<circle cx="579" cy="220" r="149" fill="#ded9b8"/><circle cx="562" cy="204" r="124" fill="#ede4c6" opacity=".4"/><path d="M0 542L192 438 341 517 594 387 1000 532V700H0Z" fill="#325269"/><path d="M301 589V316L508 222 706 322V590Z" fill="#c59076"/><path d="M508 222V587H706V322Z" fill="#a67162"/><path d="M372 588V438A74 74 0 0 1 148 0V588" fill="#203d54"/><path d="M386 588V441A60 60 0 0 1 120 0V588" fill="#f3ce8e"/><rect x="575" y="379" width="63" height="88" rx="31" fill="#f7dca0"/><path d="M373 588L506 588 561 700H265Z" fill="#ccb28f"/>'
for y,w in [(610,156),(634,181),(661,209)]:moonbody+=f'<path d="M{440-w/2} {y}h{w}" stroke="#887f7d" stroke-width="3"/>'
moonbody+='<path d="M0 639Q134 594 295 646L265 700H0ZM560 700L538 651Q771 553 1000 624V700Z" fill="#1e3a4a"/>'
(ART/'moon-house.svg').write_text(svg(moonbody,'#193148'),encoding='utf-8')

tidebody=f'<rect width="1000" height="700" fill="#112f4a"/>{stars}<path d="M0 285Q151 202 348 307T738 278T1000 314V700H0Z" fill="#2e6573"/><path d="M0 355Q216 266 407 386T766 355T1000 410V700H0Z" fill="#4b8c92"/><path d="M0 467Q184 347 399 478T751 457T1000 496V700H0Z" fill="#205467"/><path d="M0 583Q206 491 418 602T804 558T1000 611V700H0Z" fill="#43828c"/>'
for x,y,rx,ry in [(260,440,171,54),(678,540,198,58),(805,348,112,30),(218,620,102,31)]:
    tidebody+=f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="#152e46"/><ellipse cx="{x}" cy="{y-4}" rx="{rx-15}" ry="{ry-8}" fill="#173a51"/><path d="M{x-rx+5} {y+8}Q{x} {y+ry+24} {x+rx-5} {y+8}" stroke="#a4c7bd" stroke-width="2" fill="none" opacity=".55"/>'
for pts in [[(151,437),(217,421),(279,453),(349,427)],[(550,538),(629,519),(701,551),(775,525),(821,542)],[(748,344),(789,336),(852,350)]]:
    tidebody+=f'<polyline points="{" ".join(str(x)+","+str(y) for x,y in pts)}" stroke="#f0cf8055" stroke-width="2" fill="none"/>'
    for x,y in pts:tidebody+=f'<circle cx="{x}" cy="{y}" r="21" fill="url(#halo)"/><path d="M{x} {y-6}l2 4 4 2-4 2-2 4-2-4-4-2 4-2Z" fill="#ffe1a0"/>'
(ART/'tidepool-stars.svg').write_text(svg(tidebody,'#122a43'),encoding='utf-8')

doorbody=f'{stars}<circle cx="236" cy="159" r="69" fill="#d9b677"/><path d="M0 562L220 354 484 596 699 338 1000 558V700H0Z" fill="#bf926f"/><path d="M220 354L271 647 484 596ZM699 338L760 700 1000 558" fill="#8e6b62"/><path d="M0 654L307 513 532 700H0ZM523 700L781 549 1000 667V700Z" fill="#d5b287"/><path d="M405 589V243L615 210V573Z" fill="#e5d3af"/><path d="M431 566V267L591 241V555Z" fill="#338a8a"/><path d="M449 561V277L591 254V555Z" fill="#4ca8a0"/><path d="M405 243L522 293V631L405 589Z" fill="#c4b18e"/><path d="M423 274L497 307V591L423 565Z" fill="#d9c5a1"/><path d="M522 631L615 573 747 700H563Z" fill="#bde2c5" opacity=".68"/><path d="M701 229L824 178 774 262 747 222Z" fill="#f4e3bf"/><path d="M701 229L747 222 763 247Z" fill="#b4a78d"/><path d="M747 222L824 178 762 236Z" fill="#ddc9a2"/>'
(ART/'paper-door.svg').write_text(svg(doorbody,'#1c3b4c'),encoding='utf-8')

# A wholly original vector placeholder. A new generated public backdrop can replace
# it without modifying, linking or exposing the private original background.
hall='<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#0a1227"/><stop offset="1" stop-color="#243248"/></linearGradient><linearGradient id="floor" x2="0" y2="1"><stop stop-color="#253343"/><stop offset="1" stop-color="#0b1321"/></linearGradient><radialGradient id="light"><stop stop-color="#b6a17c" stop-opacity=".7"/><stop offset="1" stop-color="#b6a17c" stop-opacity="0"/></radialGradient></defs><rect width="1920" height="1080" fill="url(#sky)"/><path d="M0 0L670 425V760L0 1080ZM1920 0L1250 425V760L1920 1080Z" fill="#282b31"/><path d="M670 425Q960 220 1250 425V760H670Z" fill="#172234"/><path d="M0 1080L670 730H1250L1920 1080Z" fill="url(#floor)"/><path d="M770 1080L890 733H1030L1150 1080Z" fill="#482f35"/><ellipse cx="960" cy="714" rx="330" ry="210" fill="url(#light)"/>'
for x,y,w,h in [(42,105,145,575),(281,250,109,401),(469,357,72,280),(604,437,44,183)]:
    for side in [False,True]:
        xx=1920-x-w if side else x
        hall+=f'<path d="M{xx} {y+h}V{y+60}Q{xx+w/2} {y-40} {xx+w} {y+60}V{y+h}Z" fill="#486b8a" stroke="#7c7766" stroke-width="9"/><path d="M{xx+w/2} {y+13}V{y+h}M{xx} {y+h*.6}H{xx+w}" stroke="#737568" stroke-width="5"/>'
for x in [0,250,445,596,671]:
    xx=round(x);yy=round(185+x*.6);hall+=f'<path d="M{xx} 0L{xx} {yy}L{xx} {1010-x*.4}" stroke="#716452" stroke-width="12" opacity=".55"/><path d="M{1920-xx} 0L{1920-xx} {yy}L{1920-xx} {1010-x*.4}" stroke="#716452" stroke-width="12" opacity=".55"/>'
hall+='<path d="M855 740V538Q960 365 1065 538V740" fill="#152132" stroke="#7b7461" stroke-width="12"/><path d="M910 740V604Q960 526 1010 604V740Z" fill="#c89959"/><path d="M0 909L670 739M1920 909L1250 739M0 1000L670 739M1920 1000L1250 739" stroke="#a68c6355" stroke-width="2"/></svg>'
(ROOT/'assets'/'hall-background.svg').write_text(hall,encoding='utf-8')
(ROOT/'assets'/'favicon.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#101827"/><path d="M32 8c9 10 12 16 5 22-11 8-18-8-5-22Z" fill="#efd09a"/><rect x="27" y="34" width="10" height="21" rx="2" fill="#e8d6b6"/></svg>',encoding='utf-8')

SAMPLE_RATE=22050
DURATION=18
PI2=2*math.pi
def hz(note): return 440*2**((note-69)/12)
tracks={
    'light-left-on':([57,64,69,71,64,59,66,69,73,71,64,66],[45,52,57]),
    'letters-to-tide':([62,69,65,72,67,74,69,65,72,67,62,69],[38,53,57]),
    'under-glass-sky':([60,67,74,71,64,69,76,67,72,64,71,74],[48,55,59]),
}
for name,(notes,chord) in tracks.items():
    samples=array.array('h')
    for i in range(int(SAMPLE_RATE*DURATION)):
        t=i/SAMPLE_RATE
        fade=min(1,t/1.2,(DURATION-t)/1.4)
        pad=sum(math.sin(PI2*hz(n)*t+.22*math.sin(t*.37)) for n in chord)*.026
        value=pad
        for offset in (0,1):
            note_index=int(t/1.4)-offset
            if 0<=note_index<len(notes):
                age=t-note_index*1.4
                if age>=0:
                    f=hz(notes[note_index]);env=(1-math.exp(-age*32))*math.exp(-age*1.45)
                    value+=env*(math.sin(PI2*f*age)+.30*math.sin(PI2*f*2.003*age)+.11*math.sin(PI2*f*3.996*age))*.13
        samples.append(int(max(-.9,min(.9,value*fade))*32767))
    with wave.open(str(AUDIO/(name+'.wav')),'wb') as out:
        out.setnchannels(1);out.setsampwidth(2);out.setframerate(SAMPLE_RATE);out.writeframes(samples.tobytes())
print(json.dumps({'created_art':4,'created_tracks':3,'track_seconds':DURATION,'sample_rate':SAMPLE_RATE}))
