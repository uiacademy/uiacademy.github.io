
describe("A suite", function() {
   it("contains spec with an expectation", function() {
      expect(true).toBe(true);
   });
   
   it("Must check for parameter count", function() {
       try {
            sumIf();   
            expect.fail();
       }
       catch(e) {
       }
       try {
            sumIf(null, null, null);
            expect.fail();
       }
       catch(e) {
       }
      
   });
   
   it("Check default behavior works", function() {
      expect(sumIf([3,3,4])).toBe(10);
   });
   
   it("Check custom filtering behavior works", function() {
      expect(sumIf([3,3,4], function(a) { return a != 4 ? a : 1 })).toBe(7);
   });
}); 