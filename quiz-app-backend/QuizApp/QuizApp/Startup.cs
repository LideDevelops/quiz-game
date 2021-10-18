using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using QuizApp.Logic;
using System.Net.WebSockets;
using System.Threading.Tasks;

namespace QuizApp
{
    public class Startup
    {
        private readonly string myCorsSpeficitationName = "myCorsRules";

        // This method gets called by the runtime. Use this method to add services to the container.
        // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddSwaggerGen();
            services.AddTransient<IFieldLogic, FieldLogic>();
            services.AddCors(options =>
            {
                options.AddPolicy(name: myCorsSpeficitationName,
                                  builder =>
                                  {
                                      builder.AllowAnyOrigin();
                                  });
            });

            services.AddHostedService<BackgroundSocketProcessor>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseWebSockets();
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
                c.RoutePrefix = string.Empty;
            });
            app.UseCors(myCorsSpeficitationName);
            app.UseRouting();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}