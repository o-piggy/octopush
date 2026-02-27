// music-player.js
// Optimized for Portfolio Integration
console.log('Music Player executing...');

(function () {
    const { useState, useEffect, useRef } = React;

    const PLAYLIST_ID = 'PLZAe7ErrqpacQYh2rLxPcTYpvHoxg16hr'; // Replace with your YouTube playlist ID
    // To get your playlist ID:
    // 1. Create a PUBLIC YouTube playlist
    // 2. The URL will look like: youtube.com/playlist?list=PLxxxxxxxxxxxxxx
    // 3. Copy everything after "list=" - that's your playlist ID
    
    const MOCK_QUEUE = [
      { id: 0, title: "Track 1", artist: "Your Playlist", duration: "3:45", thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop" },
      { id: 1, title: "Track 2", artist: "Your Playlist", duration: "4:12", thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop" },
      { id: 2, title: "Track 3", artist: "Your Playlist", duration: "2:58", thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=400&fit=crop" },
      { id: 3, title: "Track 4", artist: "Your Playlist", duration: "5:20", thumbnail: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop" },
      { id: 4, title: "Track 5", artist: "Your Playlist", duration: "4:05", thumbnail: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=400&fit=crop" },
      { id: 5, title: "Track 6", artist: "Your Playlist", duration: "3:30", thumbnail: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&h=400&fit=crop" },
      { id: 6, title: "Track 7", artist: "Your Playlist", duration: "4:45", thumbnail: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop" },
      { id: 7, title: "Track 8", artist: "Your Playlist", duration: "3:15", thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop" },
    ];

    /* Inline SVG Icons */
    const IconListMusic = () => (
      React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg",width:20,height:20,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"},
        React.createElement('path',{d:"M21 15V6"}),
        React.createElement('path',{d:"M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"}),
        React.createElement('path',{d:"M12 12H3"}),
        React.createElement('path',{d:"M16 6H3"}),
        React.createElement('path',{d:"M12 18H3"})
      )
    );
    const IconX = () => (
      React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg",width:20,height:20,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"},
        React.createElement('line',{x1:18,y1:6,x2:6,y2:18}),
        React.createElement('line',{x1:6,y1:6,x2:18,y2:18})
      )
    );
    const IconSkipBack = () => (
      React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg",width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"},
        React.createElement('polygon',{points:"19 20 9 12 19 4 19 20"}),
        React.createElement('line',{x1:5,y1:19,x2:5,y2:5})
      )
    );
    const IconSkipForward = () => (
      React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg",width:22,height:22,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"},
        React.createElement('polygon',{points:"5 4 15 12 5 20 5 4"}),
        React.createElement('line',{x1:19,y1:5,x2:19,y2:19})
      )
    );
    const IconPlay = () => (
      React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg",width:26,height:26,viewBox:"0 0 24 24",fill:"currentColor",stroke:"currentColor",strokeWidth:1,style:{marginLeft:'3px'}},
        React.createElement('polygon',{points:"5 3 19 12 5 21 5 3"})
      )
    );
    const IconPause = () => (
      React.createElement('svg', {xmlns:"http://www.w3.org/2000/svg",width:26,height:26,viewBox:"0 0 24 24",fill:"currentColor",stroke:"currentColor",strokeWidth:1},
        React.createElement('rect',{x:6,y:4,width:4,height:16}),
        React.createElement('rect',{x:14,y:4,width:4,height:16})
      )
    );

    /* Inject CSS once */
    if (!document.getElementById('mp-styles')) {
      const s = document.createElement('style');
      s.id = 'mp-styles';
      s.textContent = `
        #mp-root * { box-sizing: border-box; }
        #mp-root { font-family: 'Inter', system-ui, sans-serif; }
        .mp-scrollbar::-webkit-scrollbar { width: 4px; }
        .mp-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .mp-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        .mp-range { -webkit-appearance: none; appearance: none; background: transparent; width: 100%; }
        .mp-range::-webkit-slider-runnable-track {
          height: 4px; border-radius: 2px;
          background: linear-gradient(to right, #6366f1 var(--prog, 0%), #3a3a3a var(--prog, 0%));
        }
        .mp-range::-webkit-slider-thumb {
          -webkit-appearance: none; width: 12px; height: 12px;
          border-radius: 50%; background: #6366f1; margin-top: -4px;
        }
        .mp-range::-moz-range-track { height: 4px; border-radius: 2px; background: #3a3a3a; }
        .mp-range::-moz-range-progress { background: #6366f1; border-radius: 2px; }
        .mp-range::-moz-range-thumb { width: 12px; height: 12px; border-radius: 50%; background: #6366f1; border: none; }
        @keyframes mp-bounce { 0%,100%{transform:scaleY(1)} 50%{transform:scaleY(0.35)} }
        .mp-bar { width: 3px; background: white; border-radius: 2px; transform-origin: bottom; }
        .mp-icon-btn { background: transparent; border: none; cursor: pointer; padding: 10px; color: #737373;
          transition: color .2s; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .mp-icon-btn:hover { color: #fff; }
        .mp-play-btn { width: 60px; height: 60px; border-radius: 50%; background: #fff; color: #000;
          border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5); transition: transform .15s ease; }
        .mp-play-btn:hover { transform: scale(1.08); }
        .mp-play-btn:active { transform: scale(0.95); }
        .mp-queue-item { width: 100%; display: flex; align-items: center; gap: 14px; padding: 10px 12px;
          border-radius: 14px; cursor: pointer; border: 1px solid transparent; text-align: left;
          background: transparent; transition: background .15s; color: inherit; }
        .mp-queue-item:hover { background: rgba(255,255,255,0.05); }
        .mp-queue-item.active { background: rgba(99,102,241,0.12); border-color: rgba(99,102,241,0.3); }
      `;
      document.head.appendChild(s);
    }

    function App() {
      const [player, setPlayer] = useState(null);
      const [isPlaying, setIsPlaying] = useState(false);
      const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
      const [progress, setProgress] = useState(0);
      const [isQueueOpen, setIsQueueOpen] = useState(false);

      const progressInterval = useRef(null);

      useEffect(() => {
        if (!window.YT) {
          const tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          const first = document.getElementsByTagName('script')[0];
          first.parentNode.insertBefore(tag, first);
          window.onYouTubeIframeAPIReady = initPlayer;
        } else {
          initPlayer();
        }
        return () => clearInterval(progressInterval.current);
      }, []);

      const initPlayer = () => {
        new window.YT.Player('yt-hidden', {
          height: '0', width: '0',
          playerVars: { listType: 'playlist', list: PLAYLIST_ID, controls: 0 },
          events: {
            onReady: (e) => { setPlayer(e.target); e.target.setVolume(50); },
            onStateChange: (e) => {
              setIsPlaying(e.data === 1);
              if (e.data === 1) {
                clearInterval(progressInterval.current);
                progressInterval.current = setInterval(() => {
                  const cur = e.target.getCurrentTime();
                  const dur = e.target.getDuration();
                  if (dur > 0) setProgress((cur / dur) * 100);
                }, 1000);
              } else {
                clearInterval(progressInterval.current);
              }
              const idx = e.target.getPlaylistIndex();
              if (idx >= 0) setCurrentTrackIndex(idx % MOCK_QUEUE.length);
            }
          }
        });
      };

      const track = MOCK_QUEUE[currentTrackIndex] || MOCK_QUEUE[0];

      return (
        <div id="mp-root" style={{
          width:'100%', height:'100vh', display:'flex', flexDirection:'column',
          background:'var(--card-bg)', color:'var(--text-primary)', overflow:'hidden', position:'relative',
          borderLeft:'none'
        }}>
          <div id="yt-hidden" style={{position:'absolute',width:0,height:0,overflow:'hidden'}}></div>

          {/* Header */}
          <div style={{
            display:'flex', justifyContent:'space-between', alignItems:'center',
            height:'60px', padding:'0 20px', flexShrink:0,
            borderBottom:'1px solid rgba(255,255,255,0.05)'
          }}>
            <span style={{fontSize:'10px',fontWeight:800,letterSpacing:'0.2em',color:'#525252',textTransform:'uppercase'}}>
              Now Playing
            </span>
            <button className="mp-icon-btn" onClick={() => setIsQueueOpen(true)} title="View Queue">
              <IconListMusic />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="mp-scrollbar" style={{flex:1, overflowY:'auto', padding:'20px'}}>
            {/* Album Art — padding-bottom trick for square */}
            <div style={{
              position:'relative', width:'100%', paddingBottom:'100%',
              borderRadius:'16px', overflow:'hidden',
              boxShadow:'0 20px 60px rgba(0,0,0,0.5)', marginBottom:'20px'
            }}>
              <img src={track.thumbnail} alt="Album Art" style={{
                position:'absolute', top:0, left:0, width:'100%', height:'100%',
                objectFit:'cover', transition:'transform 0.5s ease'
              }} />
              <div style={{
                position:'absolute', inset:0,
                background:'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)'
              }}></div>
            </div>

            {/* Track info */}
            <div style={{marginBottom:'22px'}}>
              <h2 style={{
                fontSize:'18px', fontWeight:700, margin:'0 0 6px',
                whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', lineHeight:1.2
              }}>{track.title}</h2>
              <p style={{
                fontSize:'12px', fontWeight:600, color:'#818cf8', margin:0,
                textTransform:'uppercase', letterSpacing:'0.08em', opacity:0.9
              }}>{track.artist}</p>
            </div>

            {/* Progress bar */}
            <div style={{marginBottom:'8px'}}>
              <input
                type="range" className="mp-range"
                min="0" max="100" value={progress} readOnly
                style={{'--prog': `${progress}%`}}
              />
              <div style={{
                display:'flex', justifyContent:'space-between', marginTop:'6px',
                fontSize:'11px', fontFamily:'monospace', color:'#525252'
              }}>
                <span>0:00</span><span>{track.duration}</span>
              </div>
            </div>
          </div>

          {/* Controls footer */}
          <div style={{
            height:'110px', padding:'0 20px', display:'flex', alignItems:'center',
            justifyContent:'center', flexShrink:0,
            background:'rgba(23,23,23,0.85)', backdropFilter:'blur(8px)',
            borderTop:'1px solid rgba(255,255,255,0.05)'
          }}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'180px'}}>
              <button className="mp-icon-btn" onClick={() => player?.previousVideo()}>
                <IconSkipBack />
              </button>
              <button
                className="mp-play-btn"
                onClick={() => player && (isPlaying ? player.pauseVideo() : player.playVideo())}
              >
                {isPlaying ? <IconPause /> : <IconPlay />}
              </button>
              <button className="mp-icon-btn" onClick={() => player?.nextVideo()}>
                <IconSkipForward />
              </button>
            </div>
          </div>

          {/* Queue overlay — controlled by transform, NOT conditional render */}
          <div style={{
            position:'absolute', inset:0, background:'#171717', zIndex:40,
            display:'flex', flexDirection:'column',
            transform: isQueueOpen ? 'translateX(0)' : 'translateX(100%)',
            transition:'transform 0.4s cubic-bezier(0.4,0,0.2,1)'
          }}>
            <div style={{
              height:'60px', display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'0 20px', borderBottom:'1px solid rgba(255,255,255,0.05)', flexShrink:0
            }}>
              <span style={{fontSize:'11px',fontWeight:800,letterSpacing:'0.25em',color:'#818cf8',textTransform:'uppercase'}}>
                Queue
              </span>
              <button className="mp-icon-btn" onClick={() => setIsQueueOpen(false)}>
                <IconX />
              </button>
            </div>

            <div className="mp-scrollbar" style={{flex:1, overflowY:'auto', padding:'12px'}}>
              {MOCK_QUEUE.map((t, i) => (
                <button
                  key={i}
                  className={`mp-queue-item${currentTrackIndex === i ? ' active' : ''}`}
                  onClick={() => { player?.playVideoAt(i); setIsQueueOpen(false); }}
                >
                  <div style={{position:'relative', flexShrink:0}}>
                    <img src={t.thumbnail} alt="" style={{
                      width:'48px', height:'48px', borderRadius:'10px',
                      objectFit:'cover', display:'block', background:'#333'
                    }}/>
                    {currentTrackIndex === i && isPlaying && (
                      <div style={{
                        position:'absolute', inset:0, background:'rgba(0,0,0,2)',
                        display:'flex', alignItems:'center', justifyContent:'center', borderRadius:'10px'
                      }}>
                        <div style={{display:'flex', alignItems:'flex-end', gap:'2px', height:'14px'}}>
                          {[{h:14,d:'1s'},{h:10,d:'1.3s'},{h:12,d:'0.8s'}].map((b,k) => (
                            <div key={k} className="mp-bar" style={{
                              height:`${b.h}px`,
                              animation:`mp-bounce ${b.d} ease-in-out infinite`
                            }}/>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{flex:1, minWidth:0}}>
                    <p style={{
                      margin:'0 0 3px', fontSize:'13px', fontWeight:700,
                      whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                      color: currentTrackIndex === i ? '#fff' : '#d4d4d4'
                    }}>{t.title}</p>
                    <p style={{
                      margin:0, fontSize:'11px', color:'#525252', fontWeight:600,
                      textTransform:'uppercase', letterSpacing:'0.04em',
                      whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'
                    }}>{t.artist}</p>
                  </div>
                  <span style={{flexShrink:0, fontSize:'10px', fontFamily:'monospace', color:'#525252'}}>
                    {t.duration}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const rootEl = document.getElementById('music-player-root');
    if (rootEl) {
        const root = ReactDOM.createRoot(rootEl);
        root.render(<App />);
    }
})();