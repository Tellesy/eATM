describe("Screens", function() {
  var ScreensService = require('../../src/services/screens.js');
  var log, settings, s;

  beforeEach(function() {
    log = {
      info: function() {
      }
    };
    
    settings = {
      get: function(value) {
        return {};
      },
      set: function(value){
      }
    };

    spyOn(settings, 'set');

    s = new ScreensService(settings, log);
  });

  describe('initCursor()', function(){
    it('should init cursor position', function(){
      s.initCursor();
      expect(s.cursor_position).toEqual({'x': 0, 'y': 0});
    })
  });

  describe('getCursorPosition()', function(){
    it('should get left top cursor position', function(){
      s.initCursor();
      expect(s.getCursorPosition()).toEqual({'x': '@', 'y': '@'});
    })

    it('should get right top cursor position', function(){
      s.cursor_position = {'x': 31, 'y': 0};
      expect(s.getCursorPosition()).toEqual({'x': '?', 'y': '@'});
    })

    it('should get bottom left cursor position', function(){
      s.cursor_position = {'x': 0, 'y': 15};
      expect(s.getCursorPosition()).toEqual({'x': '@', 'y': 'O'});
    })

    it('should get bottom right cursor position', function(){
      s.cursor_position = {'x': 31, 'y': 15};
      expect(s.getCursorPosition()).toEqual({'x': '?', 'y': 'O'});
    })

    it('should get center cursor position', function(){
      s.cursor_position = {'x': 15, 'y': 7};
      expect(s.getCursorPosition()).toEqual({'x': 'O', 'y': 'G'});
    })
  });


  describe('setCursorPosition()', function(){
    it('should set cursor position to FK', function(){
      s.initCursor();
      s.setCursorPosition('FK');
      expect(s.getCursorPosition()).toEqual({'x': 'K', 'y': 'F'});
    });

    it('should set cursor position to top left', function(){
      s.initCursor();
      s.setCursorPosition('@@');
      expect(s.getCursorPosition()).toEqual({'x': '@', 'y': '@'});
    });

    it('should set cursor position to top right', function(){
      s.initCursor();
      s.setCursorPosition('@?');
      expect(s.getCursorPosition()).toEqual({'x': '?', 'y': '@'});
    });

    it('should set cursor position to bottom left', function(){
      s.initCursor();
      s.setCursorPosition('O@');
      expect(s.getCursorPosition()).toEqual({'x': '@', 'y': 'O'});
    });

    it('should set cursor position to bottom right', function(){
      s.initCursor();
      s.setCursorPosition('O?');
      expect(s.getCursorPosition()).toEqual({'x': '?', 'y': 'O'});
    });
  })

  describe('moveCursor()', function(){
    it('should move cursor position one character right', function(){
      s.initCursor();
      expect(s.getCursorPosition()).toEqual({'x': '@', 'y': '@'});
      s.moveCursor();
      expect(s.getCursorPosition()).toEqual({'x': 'A', 'y': '@'});
    })

    it('should move cursor position five characters right', function(){
      s.initCursor();
      expect(s.getCursorPosition()).toEqual({'x': '@', 'y': '@'});
      s.moveCursor(5);
      expect(s.getCursorPosition()).toEqual({'x': 'E', 'y': '@'});
    })

    it('should move cursor to the end of top line', function(){
      s.initCursor();
      expect(s.getCursorPosition()).toEqual({'x': '@', 'y': '@'});
      s.moveCursor(31);
      expect(s.getCursorPosition()).toEqual({'x': '?', 'y': '@'});
    })

    it('should move cursor position to the next line', function(){
      s.initCursor();
      expect(s.getCursorPosition()).toEqual({'x': '@', 'y': '@'});
      s.moveCursor(32);
      expect(s.getCursorPosition()).toEqual({'x': '@', 'y': 'A'});
    })

    it('should move cursor to the bottom right in case of very large value', function(){
      s.initCursor();
      s.moveCursor(600);
      expect(s.getCursorPosition()).toEqual({'x': '?', 'y': 'O'});
    })

    it('should move cursor position to the next line', function(){
      s.initCursor();
      s.cursor_position = {'x': 31, 'y': 7};
      expect(s.getCursorPosition()).toEqual({'x': '?', 'y': 'G'});
      s.moveCursor();
      expect(s.getCursorPosition()).toEqual({'x': '@', 'y': 'H'});
    })

    it('should not move cursor if already in bottom right corner', function(){
      s.initCursor();
      s.cursor_position = {'x': 31, 'y': 15};
      expect(s.getCursorPosition()).toEqual({'x': '?', 'y': 'O'});
      s.moveCursor();
      expect(s.getCursorPosition()).toEqual({'x': '?', 'y': 'O'});
    })    
  
  });

  describe('initScreenText()', function(){
    it('should init screen text', function() {
      var initialized = { 
        '@': '                                ', 
        'A': '                                ', 
        'B': '                                ', 
        'C': '                                ', 
        'D': '                                ', 
        'E': '                                ', 
        'F': '                                ', 
        'G': '                                ', 
        'H': '                                ', 
        'I': '                                ', 
        'J': '                                ', 
        'K': '                                ', 
        'L': '                                ', 
        'M': '                                ', 
        'N': '                                ', 
        'O': '                                ' };
      expect(s.screen_text).toEqual({});
      s.initScreenText()
      expect(s.screen_text).toEqual(initialized);
    });
  });

  describe('replaceCharAt()', function(){
    it('should replace symbol in string', function(){
      expect(s.replaceCharAt('iddqd', 1, 'x')).toEqual('ixdqd');
    });

    it('should replace symbol in string', function(){
      expect(s.replaceCharAt('                                ', 0, 'X')).toEqual('X                               ');
    });
  });

  describe('addScreenText()', function(){
    beforeEach(function() {
      s.initCursor();
      s.initScreenText();
    });

    it('should add one character', function() {
      expect(s.screen_text['@'].length).toEqual(32);
      s.addScreenText('X');
      expect(s.screen_text['@'].length).toEqual(32);
      expect(s.screen_text['@']).toEqual('X                               ')
    });

    it('should replace the character', function() {
      s.addScreenText('X');
      expect(s.screen_text['@']).toEqual('X                               ')
      s.initCursor();
      s.addScreenText('Z');
      expect(s.screen_text['@']).toEqual('Z                               ')
    });

    it('should change cursor position', function() {
      expect(s.getCursorPosition()).toEqual({'x': '@', 'y': '@'});
      s.addScreenText('X');
      expect(s.getCursorPosition()).toEqual({'x': 'A', 'y': '@'})
    });

    it('should add short character string', function() {
      expect(s.getCursorPosition()).toEqual({'x': '@', 'y': '@'});
      s.addScreenText('IDDQD');
      expect(s.screen_text['@']).toEqual('IDDQD                           ')
      expect(s.getCursorPosition()).toEqual({'x': 'E', 'y': '@'});
    });

    it('should replace previous character string', function() {
      expect(s.getCursorPosition()).toEqual({'x': '@', 'y': '@'});
      s.addScreenText('IDDQD');
      expect(s.screen_text['@']).toEqual('IDDQD                           ')
      
      s.initCursor();
      s.addScreenText('XYZ');
      expect(s.screen_text['@']).toEqual('XYZQD                           ')
    });

    it('should carry the text to the next line', function() {
      s.cursor_position = {'x': 30, 'y': 0}
      expect(s.getCursorPosition()).toEqual({'x': '>', 'y': '@'});
      s.addScreenText('ABCDEFGHI');
      expect(s.screen_text['@']).toEqual('                              AB')
      expect(s.screen_text['A']).toEqual('CDEFGHI                         ')
      expect(s.getCursorPosition()).toEqual({'x': 'G', 'y': 'A'});
    });
  });
  
  describe('screenTextEmpty()', function(){
    it('should return true is text screen is empty', function(){
      s.initScreenText();
      expect(s.screenTextEmpty()).toBeTruthy();
    });

    it('should return false if the text screen is changed', function(){
      s.initScreenText();
      s.screen_text['A'] = 'IDDQD                           ';
      expect(s.screenTextEmpty()).toBeFalsy();
    })
  });

  describe("parseScreen()", function(){
    it("should return empty object on empty string", function() {
      expect(s.parseScreen('')).toBeFalsy();
    });

    it("should parse screen number", function() {
      var parsed = {
        number: '778',
      };
      expect(s.parseScreen('778')).toEqual(parsed);
    });

    it("should clear screen and put the text", function() {
      var parsed = {
        number: '039',
        clear_screen: true,
        screen_text: { 
          '@': 'TEXT                            ', 
          'A': '                                ', 
          'B': '                                ', 
          'C': '                                ', 
          'D': '                                ', 
          'E': '                                ', 
          'F': '                                ', 
          'G': '                                ', 
          'H': '                                ', 
          'I': '                                ', 
          'J': '                                ', 
          'K': '                                ', 
          'L': '                                ', 
          'M': '                                ', 
          'N': '                                ', 
          'O': '                                '
        }
      };
      expect(s.parseScreen('039\x0cTEXT')).toEqual(parsed);
    });

    it("should parse Display Image File control", function() {
      var parsed = {
        number: '000',
        clear_screen: true,
        display_image_files_control: true,
        image_file: 'PIC000.jpg',
      };
      expect(s.parseScreen('000\x0c\x1bPEPIC000.jpg\x1b\x5c')).toEqual(parsed);
    });

/*
    it("should parse Screen Blinking and Colour control", function() {
      var parsed = {
        number: '039',
        clear_screen: true,
        display_image_files_control: true,
        image_file: 'PIC039.jpg',
      };
      expect(s.parseScreen('039\x0c\x1bPEPIC039.jpg\x1b\x5c\x1b[27;80m')).toEqual(parsed);
    });
*/    
  });
  describe("addScreen()", function(){
    it("should not add invalid screen", function() {
      expect(s.addScreen('')).toBeFalsy();
      expect(settings.set).not.toHaveBeenCalled();
    });

    it("should add valid screen", function() {
      expect(s.addScreen('000\x0c\x1bPEPIC000.jpg\x1b\x5c')).toBeTruthy();
      expect(settings.set).toHaveBeenCalled();
    });
  });

  describe("add()", function(){
    it("should not add screens", function() {
      screens = [];
      expect(s.add(screens)).toBeTruthy();
    });
  });

  describe('parseDynamicScreenData()', function(){
    it('should parse dynamic screen', function(){
      var parsed = {
        number: 'DYNAMIC',
        clear_screen: true,
        display_image_files_control: true,
        image_file: 'PIC235.jpg',
        screen_text: { 
          '@': '                                ', 
          'A': '                                ', 
          'B': '                                ', 
          'C': '                                ', 
          'D': '                                ', 
          'E': '                                ', 
          'F': '                         COUPON ', 
          'G': '                                ', 
          'H': '                                ', 
          'I': '                                ', 
          'J': '                                ', 
          'K': '                                ', 
          'L': '                                ', 
          'M': '                                ', 
          'N': '                                ', 
          'O': '                                '
        }
      };
      expect(s.parseDynamicScreenData('\x0c\x0c\x1BPEPIC235.jpg\x1b\x5c\x0FFK              COUPON')).toEqual(parsed);
    })
  });

});
