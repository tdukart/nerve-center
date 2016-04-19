NerveCenter
===========

[![Build Status](https://travis-ci.org/tdukart/nerve-center.svg?branch=master)](https://travis-ci.org/tdukart/nerve-center)

NerveCenter is a lightweight JavaScript library to aid the development of simple games (or probably other apps!). It
allows your app to broadcast messages on specific channels and create listeners for them.

The impetus of this library is to simplify the creation of a master controller that a game could extend to handle a
multitude of broadcasts simply and safely. Although similar in spirit to jQuery's event system (although, of course,
not bound to the DOM), this is designed as a prototype to be extended into a full-featured controller.

Roadmap
-------
- Milestone1: Local events with publish and subscribe methods
- Milestone2: JSON-based server communication
- Milestone3: Permissioning (only allow player1 client to publish player1 events)

License
=======
Copyright (c) 2016, Todd Dukart
All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the 
following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following 
disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following 
disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products
 derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, 
INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE 
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR 
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, 
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF 
THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

